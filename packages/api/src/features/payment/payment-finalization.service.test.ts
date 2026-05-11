import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "@zanadeal/db";
import {
	BookingQuoteStatus,
	PaymentAttemptStatus,
	PaymentProvider,
} from "../../../../db/prisma/generated/enums";
import { finalizeStripeCheckoutSession } from "./payment-finalization.service";
import {
	createBookingInDb,
	getBookingByPaymentAttemptId,
} from "./booking.store";
import { getBookingQuote, updateBookingQuoteStatus } from "../booking-quote/booking-quote.store";
import { updatePaymentAttemptInDb } from "./payment.store";
import { buildHotelBookingRequestNotificationDraft } from "./payment-notification.service";

vi.mock("@zanadeal/db", () => ({
	default: {
		$transaction: vi.fn(),
	},
}));

vi.mock("../booking-quote/booking-quote.store", () => ({
	getBookingQuote: vi.fn(),
	updateBookingQuoteStatus: vi.fn(),
}));

vi.mock("./payment.store", () => ({
	updatePaymentAttemptInDb: vi.fn(),
}));

vi.mock("./booking.store", () => ({
	createBookingInDb: vi.fn(),
	getBookingByPaymentAttemptId: vi.fn(),
	updateBookingInDb: vi.fn(),
}));

vi.mock("./payment-notification.store", () => ({
	createBookingNotificationInDb: vi.fn(),
	getBookingNotificationByIdempotencyKey: vi.fn(),
}));

vi.mock("./payment-notification-processor.service", () => ({
	processHotelBookingRequestNotification: vi.fn(),
}));

vi.mock("./payment-notification.service", async () => {
	const actual = await vi.importActual<typeof import("./payment-notification.service")>(
		"./payment-notification.service",
	);

	return {
		...actual,
		buildHotelBookingRequestNotificationDraft: vi.fn(),
	};
});

describe("payment-finalization.service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
			callback({} as never),
		);
	});

	it("creates a pending-validation booking when a Stripe authorization completes", async () => {
		vi.mocked(getBookingQuote).mockResolvedValue({
			id: "quote_123",
			userId: "user_123",
			hotelId: "hotel_123",
			roomId: "room_123",
			status: BookingQuoteStatus.ACTIVE,
			checkInDate: new Date("2026-05-01T00:00:00.000Z"),
			checkOutDate: new Date("2026-05-03T00:00:00.000Z"),
			nights: 2,
			quantity: 1,
			guestCount: 2,
			currency: "MGA",
			subtotalAmount: 120000,
			discountAmount: 0,
			taxAmount: 0,
			platformFeePercentageBasisPoints: 1000,
			platformFeeAmount: 12000,
			hotelPayoutAmount: 108000,
			totalAmount: 120000,
			customerFirstName: "Ada",
			customerLastName: "Lovelace",
			customerEmail: "ada@example.com",
			customerPhoneNumber: "+261340000000",
			specialRequests: "Late arrival",
			hotel: {
				address: "Beach road",
				email: "frontdesk@hotel.test",
				name: "Hotel Test",
			},
			room: {
				images: [],
				prices: [],
				title: "Ocean Suite",
				type: "SUITE",
			},
		} as never);
		vi.mocked(getBookingByPaymentAttemptId).mockResolvedValue(null);
		vi.mocked(updatePaymentAttemptInDb).mockResolvedValue({
			id: "pay_123",
			status: PaymentAttemptStatus.SUCCEEDED,
		} as never);
		vi.mocked(updateBookingQuoteStatus).mockResolvedValue({
			id: "quote_123",
			status: BookingQuoteStatus.CONVERTED,
		} as never);
		vi.mocked(createBookingInDb).mockResolvedValue({
			id: "booking_123",
			status: "PENDING_VALIDATION",
		} as never);
		vi.mocked(buildHotelBookingRequestNotificationDraft).mockReturnValue(null);

		const result = await finalizeStripeCheckoutSession({
			paymentAttempt: {
				id: "pay_123",
				provider: PaymentProvider.STRIPE,
				providerStatus: "open",
				callbackPayload: null,
				completedAt: null,
				transactionId: null,
				quote: {
					id: "quote_123",
					userId: "user_123",
				},
				status: PaymentAttemptStatus.PROCESSING,
			} as never,
			providerPaymentStatus: "paid",
			providerSessionStatus: "complete",
			transactionId: "pi_123",
			userId: "user_123",
		});

		expect(createBookingInDb).toHaveBeenCalledWith(
			expect.objectContaining({
				checkInDate: new Date("2026-05-01T00:00:00.000Z"),
				checkOutDate: new Date("2026-05-03T00:00:00.000Z"),
				currency: "MGA",
				hotel: { connect: { id: "hotel_123" } },
				paidAmount: 120000,
				paymentAttempt: { connect: { id: "pay_123" } },
				quote: { connect: { id: "quote_123" } },
				room: { connect: { id: "room_123" } },
				status: "PENDING_VALIDATION",
				user: { connect: { id: "user_123" } },
			}),
			expect.anything(),
		);
		expect(updatePaymentAttemptInDb).toHaveBeenCalledWith(
			"pay_123",
			expect.objectContaining({
				transactionId: "pi_123",
			}),
			expect.anything(),
		);
		expect(result).toMatchObject({
			attemptStatus: PaymentAttemptStatus.SUCCEEDED,
			hotelEmailStatus: "missing_hotel_email",
			providerStatus: "complete",
		});
	});
});