import {
	BookingNotificationStatus,
	BookingQuoteStatus,
	BookingStatus,
	PaymentAttemptStatus,
	PaymentProvider,
} from "../../../../db/prisma/generated/enums";
import {
	getBookingStatsData,
	type BookingStatsBooking,
	type BookingStatsData,
	type BookingStatsEvent,
	type BookingStatsNotification,
	type BookingStatsPaymentAttempt,
	type BookingStatsQuote,
} from "./booking-stats.store";
import type {
	BookingStatsChartRecord,
	BookingStatsFiltersInput,
	BookingStatsSnapshot,
} from "./booking-stats.schemas";

const CONFIRMED_VALUE_STATUSES = new Set<BookingStatus>([
	BookingStatus.CONFIRMED,
	BookingStatus.CHECKED_IN,
	BookingStatus.CHECKED_OUT,
]);

function money(amount: number, currency = "MGA") {
	return { amount, currency };
}

function sum(values: number[]) {
	return values.reduce((total, value) => total + value, 0);
}

function countBy<TItem, TKey extends string>(
	items: TItem[],
	keys: readonly TKey[],
	getKey: (item: TItem) => TKey,
) {
	const counters = new Map<TKey, number>(keys.map((key) => [key, 0]));
	for (const item of items) {
		const key = getKey(item);
		counters.set(key, (counters.get(key) ?? 0) + 1);
	}
	return counters;
}

function statusCount(bookings: BookingStatsBooking[], status: BookingStatus) {
	return bookings.filter((booking) => booking.status === status).length;
}

function toChartRecord(booking: BookingStatsBooking): BookingStatsChartRecord {
	const isConfirmedValue = CONFIRMED_VALUE_STATUSES.has(booking.status);

	return {
		cancelledCount: booking.status === BookingStatus.CANCELLED ? 1 : 0,
		checkedInCount: booking.status === BookingStatus.CHECKED_IN ? 1 : 0,
		checkedOutCount: booking.status === BookingStatus.CHECKED_OUT ? 1 : 0,
		confirmedAmount: isConfirmedValue ? booking.totalAmount : 0,
		confirmedCount: booking.status === BookingStatus.CONFIRMED ? 1 : 0,
		date: booking.createdAt.toISOString(),
		grossPaidAmount: booking.paidAmount,
		guestCount: booking.guestCount,
		hotelPayoutAmount: booking.hotelPayoutAmount,
		noShowCount: booking.status === BookingStatus.NO_SHOW ? 1 : 0,
		nightsCount: booking.nights,
		pendingValidationCount:
			booking.status === BookingStatus.PENDING_VALIDATION ? 1 : 0,
		platformFeeAmount: booking.platformFeeAmount,
		quantityCount: booking.quantity,
		refundedAmount: booking.refundedAmount,
		rejectedCount: booking.status === BookingStatus.REJECTED ? 1 : 0,
		totalBookings: 1,
	};
}

function buildStatusBreakdown(bookings: BookingStatsBooking[]) {
	const counters = countBy(
		bookings,
		Object.values(BookingStatus),
		(booking) => booking.status,
	);

	return Object.values(BookingStatus).map((status) => ({
		count: counters.get(status) ?? 0,
		status,
	}));
}

function buildQuoteBreakdown(quotes: BookingStatsQuote[]) {
	const counters = countBy(
		quotes,
		Object.values(BookingQuoteStatus),
		(quote) => quote.status,
	);

	return Object.values(BookingQuoteStatus).map((status) => ({
		count: counters.get(status) ?? 0,
		status,
	}));
}

function buildPaymentBreakdown(paymentAttempts: BookingStatsPaymentAttempt[]) {
	return Object.values(PaymentProvider).flatMap((provider) => {
		return Object.values(PaymentAttemptStatus).map((status) => ({
			count: paymentAttempts.filter(
				(attempt) => attempt.provider === provider && attempt.status === status,
			).length,
			provider,
			status,
		}));
	});
}

function buildNotificationBreakdown(
	notifications: BookingStatsNotification[],
) {
	const counters = countBy(
		notifications,
		Object.values(BookingNotificationStatus),
		(notification) => notification.status,
	);

	return Object.values(BookingNotificationStatus).map((status) => ({
		count: counters.get(status) ?? 0,
		status,
	}));
}

function buildRecentBookings(bookings: BookingStatsBooking[]) {
	return [...bookings]
		.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
		.slice(0, 10)
		.map((booking) => ({
			checkInDate: booking.checkInDate.toISOString(),
			checkOutDate: booking.checkOutDate.toISOString(),
			createdAt: booking.createdAt.toISOString(),
			currency: booking.currency,
			guestCount: booking.guestCount,
			hotelName: booking.hotel.name,
			id: booking.id,
			roomTitle: booking.room.title,
			status: booking.status,
			totalAmount: booking.totalAmount,
		}));
}

function buildRecentEvents(events: BookingStatsEvent[]) {
	return events.map((event) => ({
		bookingId: event.bookingId,
		id: event.id,
		note: event.note,
		occurredAt: event.occurredAt.toISOString(),
		type: event.type,
	}));
}

export function buildBookingStatsSnapshot({
	data,
	filters,
	generatedAt = new Date(),
}: {
	data: BookingStatsData;
	filters: BookingStatsFiltersInput;
	generatedAt?: Date;
}): BookingStatsSnapshot {
	const { bookings, events, notifications, paymentAttempts, quotes } = data;
	const currency = bookings[0]?.currency ?? "MGA";
	const confirmedValueBookings = bookings.filter((booking) =>
		CONFIRMED_VALUE_STATUSES.has(booking.status),
	);

	const pendingPaymentCount = paymentAttempts.filter((attempt) =>
		attempt.status === PaymentAttemptStatus.PENDING ||
		attempt.status === PaymentAttemptStatus.PROCESSING,
	).length;

	return {
		chartRecords: bookings.map(toChartRecord),
		filters,
		generatedAt: generatedAt.toISOString(),
		notificationBreakdown: buildNotificationBreakdown(notifications),
		paymentBreakdown: buildPaymentBreakdown(paymentAttempts),
		quoteBreakdown: buildQuoteBreakdown(quotes),
		recentBookings: buildRecentBookings(bookings),
		recentEvents: buildRecentEvents(events),
		statusBreakdown: buildStatusBreakdown(bookings),
		summary: {
			activeQuotesCount: quotes.filter(
				(quote) => quote.status === BookingQuoteStatus.ACTIVE,
			).length,
			cancelledCount: statusCount(bookings, BookingStatus.CANCELLED),
			checkedInCount: statusCount(bookings, BookingStatus.CHECKED_IN),
			checkedOutCount: statusCount(bookings, BookingStatus.CHECKED_OUT),
			confirmedCount: statusCount(bookings, BookingStatus.CONFIRMED),
			failedNotificationCount: notifications.filter(
				(notification) => notification.status === BookingNotificationStatus.FAILED,
			).length,
			grossPaid: money(sum(bookings.map((booking) => booking.paidAmount)), currency),
			guestCount: sum(bookings.map((booking) => booking.guestCount)),
			hotelPayout: money(
				sum(confirmedValueBookings.map((booking) => booking.hotelPayoutAmount)),
				currency,
			),
			noShowCount: statusCount(bookings, BookingStatus.NO_SHOW),
			nightsCount: sum(bookings.map((booking) => booking.nights)),
			pendingPaymentCount,
			pendingValidationCount: statusCount(
				bookings,
				BookingStatus.PENDING_VALIDATION,
			),
			platformFee: money(
				sum(confirmedValueBookings.map((booking) => booking.platformFeeAmount)),
				currency,
			),
			quantityCount: sum(bookings.map((booking) => booking.quantity)),
			refunded: money(
				sum(bookings.map((booking) => booking.refundedAmount)),
				currency,
			),
			rejectedCount: statusCount(bookings, BookingStatus.REJECTED),
			totalBookings: bookings.length,
		},
	};
}

export async function getBookingStatsSnapshot(
	filters: BookingStatsFiltersInput,
): Promise<BookingStatsSnapshot> {
	const data = await getBookingStatsData(filters);
	return buildBookingStatsSnapshot({ data, filters });
}
