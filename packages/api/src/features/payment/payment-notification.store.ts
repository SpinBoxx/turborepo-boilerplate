import prisma from "@zanadeal/db";
import type {
	BookingNotification,
	Prisma,
} from "../../../../db/prisma/generated/client";
import { BookingNotificationType } from "../../../../db/prisma/generated/enums";

type BookingNotificationStoreClient = typeof prisma | Prisma.TransactionClient;

export type BookingNotificationCreateInput = Prisma.BookingNotificationCreateInput;
export type BookingNotificationUpdateInput = Prisma.BookingNotificationUpdateInput;

export type BookingNotificationDB = BookingNotification;

export async function createBookingNotificationInDb(
	data: BookingNotificationCreateInput,
	client: BookingNotificationStoreClient = prisma,
): Promise<BookingNotificationDB> {
	return await client.bookingNotification.create({ data });
}

export async function getBookingNotificationById(
	id: string,
	client: BookingNotificationStoreClient = prisma,
): Promise<BookingNotificationDB | null> {
	return await client.bookingNotification.findUnique({ where: { id } });
}

export async function getBookingNotificationByIdempotencyKey(
	idempotencyKey: string,
	client: BookingNotificationStoreClient = prisma,
): Promise<BookingNotificationDB | null> {
	return await client.bookingNotification.findUnique({
		where: { idempotencyKey },
	});
}

export async function getLatestHotelBookingRequestNotificationByPaymentAttemptId(
	paymentAttemptId: string,
	client: BookingNotificationStoreClient = prisma,
): Promise<BookingNotificationDB | null> {
	return await client.bookingNotification.findFirst({
		where: {
			paymentAttemptId,
			type: BookingNotificationType.HOTEL_BOOKING_REQUEST,
		},
		orderBy: { createdAt: "desc" },
	});
}

export async function updateBookingNotificationInDb(
	id: string,
	data: BookingNotificationUpdateInput,
	client: BookingNotificationStoreClient = prisma,
): Promise<BookingNotificationDB> {
	return await client.bookingNotification.update({
		where: { id },
		data,
	});
}

export async function acquireBookingNotificationForProcessing(
	id: string,
	client: BookingNotificationStoreClient = prisma,
): Promise<boolean> {
	const result = await client.bookingNotification.updateMany({
		where: {
			id,
			status: { in: ["PENDING", "FAILED"] },
		},
		data: {
			status: "PROCESSING",
			processedAt: new Date(),
			failureCode: null,
			failureMessage: null,
		},
	});

	return result.count > 0;
}