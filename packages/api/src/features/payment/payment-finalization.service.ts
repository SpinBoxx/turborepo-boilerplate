import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import {
	BookingNotificationStatus,
	BookingNotificationType,
	BookingQuoteStatus,
	PaymentAttemptStatus,
} from "../../../../db/prisma/generated/enums";
import type { LoggerLike } from "../../context";
import {
	getBookingQuote,
	updateBookingQuoteStatus,
} from "../booking-quote/booking-quote.store";
import {
	createBookingNotificationInDb,
	getBookingNotificationByIdempotencyKey,
	type BookingNotificationDB,
} from "./payment-notification.store";
import { processHotelBookingRequestNotification } from "./payment-notification-processor.service";
import {
	buildHotelBookingRequestNotificationDraft,
	hasHotelBookingRequestLegacySentMarker,
	mapNotificationStatusToHotelEmailStatus,
	type HotelBookingRequestEmailStatus,
} from "./payment-notification.service";
import {
	getCallbackPayloadRecord,
	toPrismaJsonValue,
} from "./payment-json.service";
import {
	type PaymentAttemptStatusDB,
	updatePaymentAttemptInDb,
} from "./payment.store";

interface PersistCompletedStripePaymentResult {
	attemptStatus: PaymentAttemptStatus;
	hotelEmailStatus: HotelBookingRequestEmailStatus;
	notification: BookingNotificationDB | null;
	providerStatus: string | null;
}

export interface FinalizeStripeCheckoutSessionInput {
	logger?: LoggerLike;
	paymentAttempt: PaymentAttemptStatusDB;
	providerPaymentStatus: string | null;
	providerSessionStatus: string | null;
	userId?: string;
}

export interface FinalizeStripeCheckoutSessionResult {
	attemptStatus: PaymentAttemptStatus;
	hotelEmailStatus: HotelBookingRequestEmailStatus;
	providerStatus: string | null;
}

export async function finalizeStripeCheckoutSession({
	logger,
	paymentAttempt,
	providerPaymentStatus,
	providerSessionStatus,
	userId,
}: FinalizeStripeCheckoutSessionInput): Promise<FinalizeStripeCheckoutSessionResult | null> {
	if (providerSessionStatus !== "complete") {
		return null;
	}

	const persistedResult = await persistCompletedStripePayment({
		paymentAttempt,
		providerPaymentStatus,
		providerSessionStatus,
		userId,
	});

	if (!persistedResult.notification) {
		return {
			attemptStatus: persistedResult.attemptStatus,
			hotelEmailStatus: persistedResult.hotelEmailStatus,
			providerStatus: persistedResult.providerStatus,
		};
	}

	const processedNotification = await processHotelBookingRequestNotification({
		logger,
		notificationId: persistedResult.notification.id,
	});

	return {
		attemptStatus: persistedResult.attemptStatus,
		hotelEmailStatus: mapNotificationStatusToHotelEmailStatus(
			processedNotification.status,
		),
		providerStatus: persistedResult.providerStatus,
	};
}

async function persistCompletedStripePayment({
	paymentAttempt,
	providerPaymentStatus,
	providerSessionStatus,
	userId,
}: {
	paymentAttempt: PaymentAttemptStatusDB;
	providerPaymentStatus: string | null;
	providerSessionStatus: string;
	userId?: string;
}): Promise<PersistCompletedStripePaymentResult> {
	return await prisma.$transaction(async (transaction) => {
		const quote = await getBookingQuote(paymentAttempt.quote.id, transaction);

		if (!quote) {
			return {
				attemptStatus: PaymentAttemptStatus.SUCCEEDED,
				hotelEmailStatus: "missing_quote",
				notification: null,
				providerStatus: providerSessionStatus,
			};
		}

		const callbackPayload = getCallbackPayloadRecord(paymentAttempt.callbackPayload);
		const completedAt = paymentAttempt.completedAt ?? new Date();
		const mergedCallbackPayload = {
			...callbackPayload,
			providerPaymentStatus,
			providerSessionStatus,
		};

		if (
			paymentAttempt.status !== PaymentAttemptStatus.SUCCEEDED ||
			paymentAttempt.providerStatus !== providerSessionStatus ||
			!paymentAttempt.completedAt
		) {
			await updatePaymentAttemptInDb(
				paymentAttempt.id,
				{
					callbackPayload: toPrismaJsonValue(mergedCallbackPayload),
					completedAt,
					events:
						paymentAttempt.status === PaymentAttemptStatus.SUCCEEDED
							? undefined
							: {
									create: {
										type: "PAYMENT_SUCCEEDED",
										actorUser: userId
											? { connect: { id: userId } }
											: undefined,
										note: "Stripe checkout completed successfully",
										metadata: {
											paymentAttemptId: paymentAttempt.id,
											providerPaymentStatus,
											providerSessionStatus,
										},
									},
							  },
					providerStatus: providerSessionStatus,
					status: PaymentAttemptStatus.SUCCEEDED,
				},
				transaction,
			);
		}

		if (quote.status === BookingQuoteStatus.ACTIVE) {
			await updateBookingQuoteStatus(
				quote.id,
				{
					convertedAt: completedAt,
					events: {
						create: {
							actorUser: userId ? { connect: { id: userId } } : undefined,
							metadata: {
								paymentAttemptId: paymentAttempt.id,
								provider: paymentAttempt.provider,
							},
							note:
								"Quote converted after successful payment authorization",
							type: "QUOTE_CONVERTED",
						},
					},
					status: BookingQuoteStatus.CONVERTED,
				},
				transaction,
			);
		}

		if (hasHotelBookingRequestLegacySentMarker(paymentAttempt.callbackPayload)) {
			return {
				attemptStatus: PaymentAttemptStatus.SUCCEEDED,
				hotelEmailStatus: "already_sent",
				notification: null,
				providerStatus: providerSessionStatus,
			};
		}

		const notificationDraft = buildHotelBookingRequestNotificationDraft({
			completedAt,
			paymentAttemptId: paymentAttempt.id,
			quote,
		});

		if (!notificationDraft) {
			return {
				attemptStatus: PaymentAttemptStatus.SUCCEEDED,
				hotelEmailStatus: "missing_hotel_email",
				notification: null,
				providerStatus: providerSessionStatus,
			};
		}

		const existingNotification = await getBookingNotificationByIdempotencyKey(
			notificationDraft.idempotencyKey,
			transaction,
		);

		if (existingNotification) {
			return {
				attemptStatus: PaymentAttemptStatus.SUCCEEDED,
				hotelEmailStatus: mapNotificationStatusToHotelEmailStatus(
					existingNotification.status,
				),
				notification: existingNotification,
				providerStatus: providerSessionStatus,
			};
		}

		const notification = await createBookingNotificationInDb(
			{
				type: BookingNotificationType.HOTEL_BOOKING_REQUEST,
				status: BookingNotificationStatus.PENDING,
				idempotencyKey: notificationDraft.idempotencyKey,
				locale: notificationDraft.locale,
				recipient: notificationDraft.recipient,
				payload: notificationDraft.payload as Prisma.InputJsonValue,
				paymentAttempt: { connect: { id: paymentAttempt.id } },
				bookingQuote: { connect: { id: quote.id } },
			},
			transaction,
		);

		return {
			attemptStatus: PaymentAttemptStatus.SUCCEEDED,
			hotelEmailStatus: "pending",
			notification,
			providerStatus: providerSessionStatus,
		};
	});
}
