import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";

const bookingQuoteInclude = {
	hotel: {
		select: {
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
): Promise<BookingQuoteDB | null> {
	return await prisma.bookingQuote.findUnique({
		where: { id },
		include: bookingQuoteInclude,
	});
}

export async function createBookingQuoteInDb(
	data: Prisma.BookingQuoteCreateInput,
): Promise<BookingQuoteDB> {
	return await prisma.bookingQuote.create({
		data,
		include: bookingQuoteInclude,
	});
}

export async function updateBookingQuoteStatus(
	id: string,
	data: Prisma.BookingQuoteUpdateInput,
): Promise<BookingQuoteDB> {
	return await prisma.bookingQuote.update({
		where: { id },
		data,
		include: bookingQuoteInclude,
	});
}
