import { describe, expect, it } from "vitest";
import {
	BookingNotificationStatus,
	BookingQuoteStatus,
	BookingStatus,
	PaymentAttemptStatus,
	PaymentProvider,
} from "../../../../db/prisma/generated/enums";
import { BookingStatsFiltersInputSchema } from "./booking-stats.schemas";
import { buildBookingStatsSnapshot } from "./booking-stats.service";
import type { BookingStatsData } from "./booking-stats.store";

const baseBooking = {
	checkInDate: new Date("2026-05-10T00:00:00.000Z"),
	checkOutDate: new Date("2026-05-12T00:00:00.000Z"),
	currency: "MGA",
	guestCount: 2,
	hotel: { name: "Hotel Ravinala" },
	hotelId: "hotel_1",
	hotelPayoutAmount: 160_000,
	id: "booking_1",
	nights: 2,
	paidAmount: 200_000,
	platformFeeAmount: 40_000,
	quantity: 1,
	refundedAmount: 0,
	room: { title: "Suite Jardin" },
	roomId: "room_1",
	totalAmount: 200_000,
};

function makeStatsData(): BookingStatsData {
	return {
		bookings: [
			{
				...baseBooking,
				createdAt: new Date("2026-04-01T10:00:00.000Z"),
				id: "booking_pending",
				status: BookingStatus.PENDING_VALIDATION,
			},
			{
				...baseBooking,
				createdAt: new Date("2026-04-02T10:00:00.000Z"),
				guestCount: 3,
				hotelPayoutAmount: 240_000,
				id: "booking_confirmed",
				paidAmount: 300_000,
				platformFeeAmount: 60_000,
				quantity: 2,
				status: BookingStatus.CONFIRMED,
				totalAmount: 300_000,
			},
			{
				...baseBooking,
				createdAt: new Date("2026-04-03T10:00:00.000Z"),
				id: "booking_cancelled",
				refundedAmount: 50_000,
				status: BookingStatus.CANCELLED,
			},
		],
		events: [
			{
				bookingId: "booking_confirmed",
				id: "event_1",
				note: "Accepted",
				occurredAt: new Date("2026-04-02T11:00:00.000Z"),
				type: "BOOKING_CONFIRMED",
			},
		],
		notifications: [
			{ status: BookingNotificationStatus.FAILED },
			{ status: BookingNotificationStatus.SENT },
		],
		paymentAttempts: [
			{ provider: PaymentProvider.STRIPE, status: PaymentAttemptStatus.PENDING },
			{ provider: PaymentProvider.STRIPE, status: PaymentAttemptStatus.SUCCEEDED },
			{
				provider: PaymentProvider.ORANGE_MONEY,
				status: PaymentAttemptStatus.PROCESSING,
			},
		],
		quotes: [
			{ status: BookingQuoteStatus.ACTIVE },
			{ status: BookingQuoteStatus.CONVERTED },
		],
	};
}

describe("BookingStatsFiltersInputSchema", () => {
	it("rejects inverted date ranges", () => {
		const result = BookingStatsFiltersInputSchema.safeParse({
			endDate: "2026-04-01T00:00:00.000Z",
			startDate: "2026-04-02T00:00:00.000Z",
		});

		expect(result.success).toBe(false);
	});

	it("rejects ranges longer than 370 days", () => {
		const result = BookingStatsFiltersInputSchema.safeParse({
			endDate: "2027-05-01T00:00:00.000Z",
			startDate: "2026-01-01T00:00:00.000Z",
		});

		expect(result.success).toBe(false);
	});
});

describe("buildBookingStatsSnapshot", () => {
	it("aggregates operational booking metrics without customer PII", () => {
		const snapshot = buildBookingStatsSnapshot({
			data: makeStatsData(),
			filters: { granularity: "day" },
			generatedAt: new Date("2026-04-04T00:00:00.000Z"),
		});

		expect(snapshot.summary).toMatchObject({
			activeQuotesCount: 1,
			cancelledCount: 1,
			confirmedCount: 1,
			failedNotificationCount: 1,
			guestCount: 7,
			pendingPaymentCount: 2,
			pendingValidationCount: 1,
			quantityCount: 4,
			totalBookings: 3,
		});
		expect(snapshot.summary.grossPaid).toEqual({
			amount: 700_000,
			currency: "MGA",
		});
		expect(snapshot.summary.platformFee).toEqual({
			amount: 60_000,
			currency: "MGA",
		});
		expect(snapshot.summary.hotelPayout).toEqual({
			amount: 240_000,
			currency: "MGA",
		});
		expect(snapshot.chartRecords).toHaveLength(3);
		expect(snapshot.chartRecords[1]).toMatchObject({
			confirmedAmount: 300_000,
			confirmedCount: 1,
			totalBookings: 1,
		});
		expect(snapshot.recentBookings[0]).not.toHaveProperty("customerEmail");
	});
});
