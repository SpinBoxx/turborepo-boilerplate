import { describe, expect, it, vi } from "vitest";
import { BookingStatus } from "../../../../db/prisma/generated/enums";
import {
	publishBookingStatsInvalidate,
	subscribeToBookingStatsInvalidations,
} from "./booking-stats.events";

describe("booking stats invalidation events", () => {
	it("notifies subscribers and supports unsubscribe", () => {
		const listener = vi.fn();
		const unsubscribe = subscribeToBookingStatsInvalidations(listener);

		const event = publishBookingStatsInvalidate({
			bookingId: "booking_123",
			hotelId: "hotel_123",
			occurredAt: new Date("2026-04-29T10:00:00.000Z"),
			status: BookingStatus.CONFIRMED,
			type: "booking.reviewed",
		});

		expect(listener).toHaveBeenCalledWith(
			expect.objectContaining({
				bookingId: "booking_123",
				eventId: event.eventId,
				occurredAt: "2026-04-29T10:00:00.000Z",
				type: "booking.reviewed",
			}),
		);

		unsubscribe();
		publishBookingStatsInvalidate({ type: "booking.created" });

		expect(listener).toHaveBeenCalledTimes(1);
	});
});
