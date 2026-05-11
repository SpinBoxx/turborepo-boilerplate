import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
type BookingQuoteStoreClient = typeof prisma | Prisma.TransactionClient;

const bookingQuoteInclude = {
	hotel: {
		select: {
			email: true,
			name: true,
			address: true,
		},
	},
	room: {
		select: {
			title: true,
			type: true,
			images: { take: 1 },
			prices: true,
		},
	},
} satisfies Prisma.BookingQuoteInclude;

export type BookingQuoteDB = Prisma.BookingQuoteGetPayload<{
	include: typeof bookingQuoteInclude;
}>;

export async function getBookingQuote(
	id: string,
	client: BookingQuoteStoreClient = prisma,
): Promise<BookingQuoteDB | null> {
	return await client.bookingQuote.findUnique({
		where: { id },
		include: bookingQuoteInclude,
	});
}

export async function createBookingQuoteInDb(
	data: Prisma.BookingQuoteCreateInput,
	client: BookingQuoteStoreClient = prisma,
): Promise<BookingQuoteDB> {
	return await client.bookingQuote.create({
		data,
		include: bookingQuoteInclude,
	});
}

export async function updateBookingQuoteStatus(
	id: string,
	data: Prisma.BookingQuoteUpdateInput,
	client: BookingQuoteStoreClient = prisma,
): Promise<BookingQuoteDB> {
	return await client.bookingQuote.update({
		where: { id },
		data,
		include: bookingQuoteInclude,
	});
}
