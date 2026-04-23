import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import {
	BookingNotificationStatus,
	BookingNotificationType,
	BookingQuoteStatus,
	PaymentAttemptStatus,
} from "../../../../db/prisma/generated/enums";
import {
	getBookingQuote,
	updateBookingQuoteStatus,
} from "../booking-quote/booking-quote.store";
import {
	createBookingInDb,
	getBookingByPaymentAttemptId,
	type BookingCreateInput,
} from "./booking.store";
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
	paymentAttempt: PaymentAttemptStatusDB;
	providerPaymentStatus: string | null;
	providerSessionStatus: string | null;
	transactionId?: string | null;
	userId?: string;
}

export interface FinalizeStripeCheckoutSessionResult {
	attemptStatus: PaymentAttemptStatus;
	hotelEmailStatus: HotelBookingRequestEmailStatus;
	providerStatus: string | null;
}

export async function finalizeStripeCheckoutSession({
	paymentAttempt,
	providerPaymentStatus,
	providerSessionStatus,
	transactionId,
	userId,
}: FinalizeStripeCheckoutSessionInput): Promise<FinalizeStripeCheckoutSessionResult | null> {
	if (providerSessionStatus !== "complete") {
		return null;
	}

	const persistedResult = await persistCompletedStripePayment({
		paymentAttempt,
		providerPaymentStatus,
		providerSessionStatus,
		transactionId,
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
	transactionId,
	userId,
}: {
	paymentAttempt: PaymentAttemptStatusDB;
	providerPaymentStatus: string | null;
	providerSessionStatus: string;
	transactionId?: string | null;
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
		const resolvedTransactionId = transactionId ?? paymentAttempt.transactionId ?? null;
		const mergedCallbackPayload = {
			...callbackPayload,
			providerPaymentStatus,
			providerSessionStatus,
		};

		if (
			paymentAttempt.status !== PaymentAttemptStatus.SUCCEEDED ||
			paymentAttempt.providerStatus !== providerSessionStatus ||
			paymentAttempt.transactionId !== resolvedTransactionId ||
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
					transactionId: resolvedTransactionId,
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

		await ensurePendingValidationBooking({
			completedAt,
			paymentAttempt,
			quote,
			transaction,
			userId,
		});

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

async function ensurePendingValidationBooking({
	completedAt,
	paymentAttempt,
	quote,
	transaction,
	userId,
}: {
	completedAt: Date;
	paymentAttempt: PaymentAttemptStatusDB;
	quote: NonNullable<Awaited<ReturnType<typeof getBookingQuote>>>;
	transaction: Prisma.TransactionClient;
	userId?: string;
}) {
	const existingBooking = await getBookingByPaymentAttemptId(
		paymentAttempt.id,
		transaction,
	);

	if (existingBooking) {
		return existingBooking;
	}

	const bookingData: BookingCreateInput = {
		checkInDate: quote.checkInDate,
		checkOutDate: quote.checkOutDate,
		confirmedAt: null,
		currency: quote.currency,
		customerEmail: quote.customerEmail,
		customerFirstName: quote.customerFirstName,
		customerLastName: quote.customerLastName,
		customerPhoneNumber: quote.customerPhoneNumber,
		discountAmount: quote.discountAmount,
		guestCount: quote.guestCount,
		hotel: { connect: { id: quote.hotelId } },
		hotelPayoutAmount: quote.hotelPayoutAmount,
		nights: quote.nights,
		paidAmount: quote.totalAmount,
		paidAt: completedAt,
		paymentAttempt: { connect: { id: paymentAttempt.id } },
		platformFeeAmount: quote.platformFeeAmount,
		platformFeePercentageBasisPoints:
			quote.platformFeePercentageBasisPoints,
		quantity: quote.quantity,
		quote: { connect: { id: quote.id } },
		refundedAmount: 0,
		room: { connect: { id: quote.roomId } },
		specialRequests: quote.specialRequests,
		status: "PENDING_VALIDATION",
		subtotalAmount: quote.subtotalAmount,
		taxAmount: quote.taxAmount,
		totalAmount: quote.totalAmount,
		user: quote.userId ? { connect: { id: quote.userId } } : undefined,
		events: {
			create: {
				actorUser: userId ? { connect: { id: userId } } : undefined,
				metadata: {
					paymentAttemptId: paymentAttempt.id,
					quoteId: quote.id,
				},
				note: "Booking created after successful payment authorization",
				type: "BOOKING_PENDING_VALIDATION",
			},
		},
	};

	return await createBookingInDb(bookingData, transaction);
}
