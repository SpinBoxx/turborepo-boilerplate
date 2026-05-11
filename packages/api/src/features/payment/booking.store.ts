import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";

type BookingStoreClient = typeof prisma | Prisma.TransactionClient;
export type BookingCreateInput = Prisma.BookingCreateInput;

export type BookingDecisionDB = Prisma.BookingGetPayload<{
	select: {
		checkInDate: true;
		checkOutDate: true;
		currency: true;
		customerEmail: true;
		customerFirstName: true;
		customerLastName: true;
		guestCount: true;
		hotel: {
			select: {
				name: true;
			};
		};
		id: true;
		hotelId: true;
		paymentAttemptId: true;
		room: {
			select: {
				title: true;
			};
		};
		specialRequests: true;
		status: true;
		totalAmount: true;
	};
}>;

export async function getBookingByPaymentAttemptId(
	paymentAttemptId: string,
	client: BookingStoreClient = prisma,
): Promise<BookingDecisionDB | null> {
	return await client.booking.findUnique({
		where: { paymentAttemptId },
		select: {
			checkInDate: true,
			checkOutDate: true,
			currency: true,
			customerEmail: true,
			customerFirstName: true,
			customerLastName: true,
			guestCount: true,
			hotel: {
				select: {
					name: true,
				},
			},
			id: true,
			hotelId: true,
			paymentAttemptId: true,
			room: {
				select: {
					title: true,
				},
			},
			specialRequests: true,
			status: true,
			totalAmount: true,
		},
	});
}

export async function updateBookingInDb(
	id: string,
	data: Prisma.BookingUpdateInput,
	client: BookingStoreClient = prisma,
) {
	return await client.booking.update({
		where: { id },
		data,
	});
}

export async function createBookingInDb(
	data: BookingCreateInput,
	client: BookingStoreClient = prisma,
) {
	return await client.booking.create({ data });
}