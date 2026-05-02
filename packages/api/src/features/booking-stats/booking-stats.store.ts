import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type { BookingStatsFiltersInput } from "./booking-stats.schemas";

const bookingSelect = {
	checkInDate: true,
	checkOutDate: true,
	createdAt: true,
	currency: true,
	guestCount: true,
	hotel: {
		select: {
			name: true,
		},
	},
	hotelId: true,
	hotelPayoutAmount: true,
	id: true,
	nights: true,
	paidAmount: true,
	platformFeeAmount: true,
	quantity: true,
	refundedAmount: true,
	room: {
		select: {
			title: true,
		},
	},
	roomId: true,
	status: true,
	totalAmount: true,
} satisfies Prisma.BookingSelect;

const quoteSelect = {
	status: true,
} satisfies Prisma.BookingQuoteSelect;

const paymentAttemptSelect = {
	provider: true,
	status: true,
} satisfies Prisma.PaymentAttemptSelect;

const notificationSelect = {
	status: true,
} satisfies Prisma.BookingNotificationSelect;

const eventSelect = {
	bookingId: true,
	id: true,
	note: true,
	occurredAt: true,
	type: true,
} satisfies Prisma.BookingEventSelect;

export type BookingStatsBooking = Prisma.BookingGetPayload<{
	select: typeof bookingSelect;
}>;
export type BookingStatsQuote = Prisma.BookingQuoteGetPayload<{
	select: typeof quoteSelect;
}>;
export type BookingStatsPaymentAttempt = Prisma.PaymentAttemptGetPayload<{
	select: typeof paymentAttemptSelect;
}>;
export type BookingStatsNotification = Prisma.BookingNotificationGetPayload<{
	select: typeof notificationSelect;
}>;
export type BookingStatsEvent = Prisma.BookingEventGetPayload<{
	select: typeof eventSelect;
}>;

export type BookingStatsData = {
	bookings: BookingStatsBooking[];
	events: BookingStatsEvent[];
	notifications: BookingStatsNotification[];
	paymentAttempts: BookingStatsPaymentAttempt[];
	quotes: BookingStatsQuote[];
};

function createdAtRange(filters: BookingStatsFiltersInput) {
	if (!filters.startDate && !filters.endDate) {
		return undefined;
	}

	return {
		gte: filters.startDate,
		lte: filters.endDate,
	};
}

function bookingWhere(filters: BookingStatsFiltersInput): Prisma.BookingWhereInput {
	return {
		createdAt: createdAtRange(filters),
		hotelId: filters.hotelId,
		paymentAttempt: filters.paymentProvider
			? { is: { provider: filters.paymentProvider } }
			: undefined,
		roomId: filters.roomId,
		status: filters.statuses?.length ? { in: filters.statuses } : undefined,
	};
}

function quoteWhere(
	filters: BookingStatsFiltersInput,
): Prisma.BookingQuoteWhereInput {
	return {
		createdAt: createdAtRange(filters),
		hotelId: filters.hotelId,
		paymentAttempts: filters.paymentProvider
			? { some: { provider: filters.paymentProvider } }
			: undefined,
		roomId: filters.roomId,
	};
}

function paymentAttemptWhere(
	filters: BookingStatsFiltersInput,
): Prisma.PaymentAttemptWhereInput {
	return {
		createdAt: createdAtRange(filters),
		provider: filters.paymentProvider,
		quote: {
			hotelId: filters.hotelId,
			roomId: filters.roomId,
		},
	};
}

function notificationWhere(
	filters: BookingStatsFiltersInput,
): Prisma.BookingNotificationWhereInput {
	return {
		createdAt: createdAtRange(filters),
		bookingQuote: {
			hotelId: filters.hotelId,
			roomId: filters.roomId,
		},
		paymentAttempt: filters.paymentProvider
			? { is: { provider: filters.paymentProvider } }
			: undefined,
	};
}

function eventWhere(filters: BookingStatsFiltersInput): Prisma.BookingEventWhereInput {
	return {
		occurredAt: createdAtRange(filters),
		booking: {
			hotelId: filters.hotelId,
			roomId: filters.roomId,
			status: filters.statuses?.length ? { in: filters.statuses } : undefined,
		},
		paymentAttempt: filters.paymentProvider
			? { is: { provider: filters.paymentProvider } }
			: undefined,
	};
}

export async function getBookingStatsData(
	filters: BookingStatsFiltersInput,
): Promise<BookingStatsData> {
	const [bookings, quotes, paymentAttempts, notifications, events] =
		await Promise.all([
			prisma.booking.findMany({
				orderBy: { createdAt: "asc" },
				select: bookingSelect,
				where: bookingWhere(filters),
			}),
			prisma.bookingQuote.findMany({
				select: quoteSelect,
				where: quoteWhere(filters),
			}),
			prisma.paymentAttempt.findMany({
				select: paymentAttemptSelect,
				where: paymentAttemptWhere(filters),
			}),
			prisma.bookingNotification.findMany({
				select: notificationSelect,
				where: notificationWhere(filters),
			}),
			prisma.bookingEvent.findMany({
				orderBy: { occurredAt: "desc" },
				select: eventSelect,
				take: 20,
				where: eventWhere(filters),
			}),
		]);

	return { bookings, events, notifications, paymentAttempts, quotes };
}
