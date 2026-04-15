import type {
	HotelBookingRequestMailLocale,
	MailService,
} from "@zanadeal/mailer";
import { BookingNotificationStatus } from "../../../../db/prisma/generated/enums";
import type { LoggerLike } from "../../context";
import {
	acquireBookingNotificationForProcessing,
	getBookingNotificationById,
	type BookingNotificationDB,
	updateBookingNotificationInDb,
} from "./payment-notification.store";
import {
	getCallbackPayloadRecord,
	toPrismaJsonValue,
} from "./payment-json.service";
import {
	parseHotelBookingRequestNotificationPayload,
} from "./payment-notification.service";
import { getPaymentAttemptById, updatePaymentAttemptInDb } from "./payment.store";

export interface ProcessHotelBookingRequestNotificationInput {
	logger?: LoggerLike;
	notificationId: string;
}

export async function processHotelBookingRequestNotification({
	logger,
	notificationId,
}: ProcessHotelBookingRequestNotificationInput): Promise<BookingNotificationDB> {
	const existingNotification = await getBookingNotificationById(notificationId);

	if (!existingNotification) {
		throw new Error(`Booking notification ${notificationId} could not be found`);
	}

	if (existingNotification.status === BookingNotificationStatus.SENT) {
		return existingNotification;
	}

	const acquired = await acquireBookingNotificationForProcessing(notificationId);
	if (!acquired) {
		const currentNotification = await getBookingNotificationById(notificationId);
		if (!currentNotification) {
			throw new Error(`Booking notification ${notificationId} could not be found`);
		}

		return currentNotification;
	}

	const lockedNotification = await getBookingNotificationById(notificationId);
	if (!lockedNotification) {
		throw new Error(`Booking notification ${notificationId} could not be found`);
	}

	const payload = parseHotelBookingRequestNotificationPayload(
		lockedNotification.payload,
	);

	if (!payload) {
		return await updateBookingNotificationInDb(notificationId, {
			status: BookingNotificationStatus.FAILED,
			failureCode: "invalid_payload",
			failureMessage: "Hotel booking request notification payload is invalid",
			processedAt: new Date(),
		});
	}

	try {
		const mailService = await getMailService();
		const sendResult = await mailService.sendHotelBookingRequestMail({
			locale: toMailLocale(lockedNotification.locale),
			to: lockedNotification.recipient,
			variables: {
				acceptUrl: payload.acceptUrl,
				bookingReference: payload.bookingReference,
				checkInDate: payload.checkInDate,
				checkOutDate: payload.checkOutDate,
				currency: payload.currency,
				guestCount: payload.guestCount,
				guestName: payload.guestName,
				hotelName: payload.hotelName,
				priceLabel: payload.priceLabel,
				rejectUrl: payload.rejectUrl,
				reviewDeadline: payload.reviewDeadline,
				roomTitle: payload.roomTitle,
				specialRequests: payload.specialRequests ?? undefined,
				supportEmail: payload.supportEmail,
				totalAmount: payload.totalAmount,
			},
		});

		if (lockedNotification.paymentAttemptId) {
			const paymentAttempt = await getPaymentAttemptById(
				lockedNotification.paymentAttemptId,
			);

			if (paymentAttempt) {
				const callbackPayload = getCallbackPayloadRecord(paymentAttempt.callbackPayload);
				await updatePaymentAttemptInDb(paymentAttempt.id, {
					callbackPayload: toPrismaJsonValue({
						...callbackPayload,
						hotelBookingRequestEmailProviderMessageId: sendResult.emailId,
						hotelBookingRequestEmailSentAt: new Date().toISOString(),
						hotelBookingRequestEmailTo: lockedNotification.recipient,
					}),
				});
			}
		}

		logger?.info?.(
			{
				emailId: sendResult.emailId,
				notificationId,
				recipient: lockedNotification.recipient,
			},
			"Hotel booking request notification sent",
		);

		return await updateBookingNotificationInDb(notificationId, {
			status: BookingNotificationStatus.SENT,
			providerMessageId: sendResult.emailId,
			failureCode: null,
			failureMessage: null,
			processedAt: new Date(),
			sentAt: new Date(),
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown notification delivery failure";

		logger?.error?.(
			{
				error,
				notificationId,
				recipient: lockedNotification.recipient,
			},
			"Failed to send hotel booking request notification",
		);

		return await updateBookingNotificationInDb(notificationId, {
			status: BookingNotificationStatus.FAILED,
			failureCode: "delivery_failed",
			failureMessage: message,
			processedAt: new Date(),
		});
	}
}

async function getMailService(): Promise<MailService> {
	const { mailService } = await import("@zanadeal/mailer");
	return mailService;
}

function toMailLocale(locale: string): HotelBookingRequestMailLocale {
	if (locale === "fr" || locale === "mg") {
		return locale;
	}

	return "en";
}