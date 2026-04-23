import { describe, expect, it } from "vitest";
import {
	buildHotelBookingRequestNotificationDraft,
	buildHotelBookingRequestActionUrls,
	getHotelBookingRequestRecipients,
	shouldNotifyHotelBookingRequestEmail,
} from "./payment-notification.service";

describe("payment-notification.service", () => {
	it("only keeps hotel.email as the booking request recipient", () => {
		expect(
			getHotelBookingRequestRecipients({
				contacts: [
					{ email: "frontdesk@hotel.test" },
					{ email: "reservations@hotel.test" },
					{ email: "frontdesk@hotel.test" },
				],
				email: "frontdesk@hotel.test",
			}),
		).toEqual(["frontdesk@hotel.test"]);

		expect(
			getHotelBookingRequestRecipients({
				contacts: [{ email: "reservations@hotel.test" }],
				email: null,
			}),
		).toEqual(["reservations@hotel.test"]);
	});

	it("falls back to the first hotel contact when hotel.email is missing", () => {
		const draft = buildHotelBookingRequestNotificationDraft({
			completedAt: new Date("2026-04-15T10:00:00.000Z"),
			paymentAttemptId: "pay_contact_only",
			quote: {
				checkInDate: new Date("2026-05-01T00:00:00.000Z"),
				checkOutDate: new Date("2026-05-03T00:00:00.000Z"),
				contacts: [],
				currency: "MGA",
				customerFirstName: "Ada",
				customerLastName: "Lovelace",
				guestCount: 2,
				hotel: {
					address: "Beach road",
					contacts: [{ email: "reservations@hotel.test" }],
					email: null,
					name: "Hotel Test",
				},
				id: "quote_contact_only",
				room: {
					images: [],
					prices: [],
					title: "Ocean Suite",
					type: "SUITE",
				},
				specialRequests: null,
				totalAmount: 125000,
			} as never,
		});

		expect(draft?.recipient).toBe("reservations@hotel.test");
	});

	it("builds stable approve and reject admin URLs", () => {
		expect(
			buildHotelBookingRequestActionUrls({
				adminUrl: "https://admin.zanadeal.test",
				paymentAttemptId: "pay_123",
				quoteId: "quote_123",
			}),
		).toEqual({
			acceptUrl:
				"https://admin.zanadeal.test/bookings/requests/approve?paymentAttemptId=pay_123&quoteId=quote_123",
			rejectUrl:
				"https://admin.zanadeal.test/bookings/requests/reject?paymentAttemptId=pay_123&quoteId=quote_123",
		});
	});

	it("only triggers the hotel email once when checkout is complete", () => {
		expect(
			shouldNotifyHotelBookingRequestEmail({
				paymentAttempt: {
					callbackPayload: null,
					provider: "STRIPE",
				},
				providerSessionStatus: "complete",
			}),
		).toBe(true);

		expect(
			shouldNotifyHotelBookingRequestEmail({
				paymentAttempt: {
					callbackPayload: { hotelBookingRequestEmailSentAt: "2026-04-11T18:00:00.000Z" },
					provider: "STRIPE",
				},
				providerSessionStatus: "complete",
			}),
		).toBe(false);

		expect(
			shouldNotifyHotelBookingRequestEmail({
				paymentAttempt: {
					callbackPayload: null,
					provider: "STRIPE",
				},
				providerSessionStatus: "open",
			}),
		).toBe(false);
	});

	it("builds a serializable hotel booking notification draft from the quote", () => {
		const draft = buildHotelBookingRequestNotificationDraft({
			completedAt: new Date("2026-04-15T10:00:00.000Z"),
			paymentAttemptId: "pay_123",
			quote: {
				checkInDate: new Date("2026-05-01T00:00:00.000Z"),
				checkOutDate: new Date("2026-05-03T00:00:00.000Z"),
				currency: "MGA",
				customerFirstName: "Ada",
				customerLastName: "Lovelace",
				guestCount: 2,
				hotel: {
					address: "Beach road",
					email: "frontdesk@hotel.test",
					name: "Hotel Test",
				},
				id: "quote_123",
				room: {
					images: [],
					prices: [],
					title: "Ocean Suite",
					type: "SUITE",
				},
				specialRequests: "Late arrival",
				totalAmount: 125000,
			} as never,
		});

		expect(draft).toMatchObject({
			idempotencyKey: "hotel-booking-request:pay_123",
			locale: "en",
			recipient: "frontdesk@hotel.test",
		});
		expect(draft?.payload.acceptUrl).toContain("paymentAttemptId=pay_123");
		expect(draft?.payload.rejectUrl).toContain("quoteId=quote_123");
		expect(draft?.payload.specialRequests).toBe("Late arrival");
	});
});