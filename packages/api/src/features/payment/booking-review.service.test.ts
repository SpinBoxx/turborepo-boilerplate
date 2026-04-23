import { beforeEach, describe, expect, it, vi } from "vitest";
import { mailService } from "@zanadeal/mailer";
import { BookingStatus, PaymentProvider } from "../../../../db/prisma/generated/enums";
import { PaymentProviderError } from "./providers/payment-provider.types";
import { reviewBookingRequest } from "./booking-review.service";
import {
	getBookingByPaymentAttemptId,
	updateBookingInDb,
} from "./booking.store";
import { getPaymentProviderOrThrow } from "./providers/payment-provider-registry";
import { getPaymentAttemptById, updatePaymentAttemptInDb } from "./payment.store";

vi.mock("./booking.store", () => ({
	getBookingByPaymentAttemptId: vi.fn(),
	updateBookingInDb: vi.fn(),
}));

vi.mock("./payment.store", () => ({
	getPaymentAttemptById: vi.fn(),
	updatePaymentAttemptInDb: vi.fn(),
}));

vi.mock("./providers/payment-provider-registry", () => ({
	getPaymentProviderOrThrow: vi.fn(),
}));

vi.mock("@zanadeal/mailer", () => ({
	mailService: {
		sendHotelBookingCancelledMail: vi.fn(),
		sendHotelBookingRequestMail: vi.fn(),
		sendHotelBookingSuccessMail: vi.fn(),
	},
}));

describe("booking-review.service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("confirms a pending booking and captures the authorized Stripe payment", async () => {
		vi.mocked(getBookingByPaymentAttemptId).mockResolvedValue({
			checkInDate: new Date("2026-05-01T00:00:00.000Z"),
			checkOutDate: new Date("2026-05-03T00:00:00.000Z"),
			currency: "MGA",
			customerEmail: "ada@example.com",
			customerFirstName: "Ada",
			customerLastName: "Lovelace",
			guestCount: 2,
			hotel: {
				name: "Hotel Test",
			},
			id: "booking_123",
			paymentAttemptId: "pay_123",
			room: {
				title: "Ocean Suite",
			},
			specialRequests: "Late arrival after 10pm",
			hotelId: "hotel_123",
			status: BookingStatus.PENDING_VALIDATION,
			totalAmount: 120000,
		} as never);
		vi.mocked(getPaymentAttemptById).mockResolvedValue({
			id: "pay_123",
			provider: PaymentProvider.STRIPE,
			providerReference: "cs_test_123",
			providerStatus: "complete",
			transactionId: "pi_123",
			quote: {
				id: "quote_123",
				userId: "user_123",
			},
		} as never);
		vi.mocked(updateBookingInDb).mockResolvedValue({
			id: "booking_123",
			status: BookingStatus.CONFIRMED,
		} as never);
		vi.mocked(updatePaymentAttemptInDb).mockResolvedValue({
			id: "pay_123",
			providerStatus: "captured",
		} as never);
		vi.mocked(mailService.sendHotelBookingSuccessMail).mockResolvedValue({
			emailId: "email_123",
		});
		const captureAuthorizedPayment = vi.fn().mockResolvedValue({
			providerStatus: "captured",
		});
		vi.mocked(getPaymentProviderOrThrow).mockReturnValue({
			provider: PaymentProvider.STRIPE,
			captureAuthorizedPayment,
			startPayment: vi.fn(),
		} as never);

		const result = await reviewBookingRequest({
			actorUserId: "admin_123",
			decision: "ACCEPT",
			paymentAttemptId: "pay_123",
			validationNote: "Availability confirmed by hotel",
		});

		expect(captureAuthorizedPayment).toHaveBeenCalledWith({
			paymentAttempt: {
				id: "pay_123",
				providerReference: "cs_test_123",
				providerStatus: "complete",
				transactionId: "pi_123",
			},
		});
		expect(updateBookingInDb).toHaveBeenCalledWith(
			"booking_123",
			expect.objectContaining({
				confirmedAt: expect.any(Date),
				status: BookingStatus.CONFIRMED,
				validationNote: "Availability confirmed by hotel",
				validatedByUser: { connect: { id: "admin_123" } },
			}),
		);
		expect(mailService.sendHotelBookingSuccessMail).toHaveBeenCalledWith({
			locale: "en",
			to: "ada@example.com",
			variables: {
				bookingReference: "booking_123",
				checkInDate: "2026-05-01T00:00:00.000Z",
				checkOutDate: "2026-05-03T00:00:00.000Z",
				guestCount: 2,
				guestName: "Ada Lovelace",
				hotelName: "Hotel Test",
				priceLabel: expect.any(String),
				roomTitle: "Ocean Suite",
				specialRequests: "Late arrival after 10pm",
				supportEmail: "contact@zanadeal.com",
			},
		});
		expect(result).toMatchObject({
			bookingId: "booking_123",
			decision: "ACCEPT",
			status: BookingStatus.CONFIRMED,
		});
	});

	it("rejects a pending booking and cancels the authorized Stripe payment", async () => {
		vi.mocked(getBookingByPaymentAttemptId).mockResolvedValue({
			checkInDate: new Date("2026-06-10T00:00:00.000Z"),
			checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
			currency: "EUR",
			customerEmail: "grace@example.com",
			customerFirstName: "Grace",
			customerLastName: "Hopper",
			guestCount: 3,
			hotel: {
				name: "Lagoon Retreat",
			},
			id: "booking_456",
			paymentAttemptId: "pay_456",
			room: {
				title: "Family Villa",
			},
			specialRequests: "Vegetarian breakfast if possible",
			hotelId: "hotel_123",
			status: BookingStatus.PENDING_VALIDATION,
			totalAmount: 45000,
		} as never);
		vi.mocked(getPaymentAttemptById).mockResolvedValue({
			id: "pay_456",
			provider: PaymentProvider.STRIPE,
			providerReference: "cs_test_456",
			providerStatus: "complete",
			transactionId: "pi_456",
			quote: {
				id: "quote_456",
				userId: "user_123",
			},
		} as never);
		vi.mocked(updateBookingInDb).mockResolvedValue({
			id: "booking_456",
			status: BookingStatus.REJECTED,
		} as never);
		vi.mocked(updatePaymentAttemptInDb).mockResolvedValue({
			id: "pay_456",
			providerStatus: "cancelled",
		} as never);
		vi.mocked(mailService.sendHotelBookingCancelledMail).mockResolvedValue({
			emailId: "email_456",
		});
		const cancelAuthorizedPayment = vi.fn().mockResolvedValue({
			providerStatus: "cancelled",
		});
		vi.mocked(getPaymentProviderOrThrow).mockReturnValue({
			cancelAuthorizedPayment,
			provider: PaymentProvider.STRIPE,
			startPayment: vi.fn(),
		} as never);

		const result = await reviewBookingRequest({
			actorUserId: "admin_123",
			decision: "REJECT",
			paymentAttemptId: "pay_456",
			rejectionReason: "No availability left for these dates",
		});

		expect(cancelAuthorizedPayment).toHaveBeenCalledWith({
			paymentAttempt: {
				id: "pay_456",
				providerReference: "cs_test_456",
				providerStatus: "complete",
				transactionId: "pi_456",
			},
		});
		expect(updateBookingInDb).toHaveBeenCalledWith(
			"booking_456",
			expect.objectContaining({
				rejectedAt: expect.any(Date),
				rejectionReason: "No availability left for these dates",
				status: BookingStatus.REJECTED,
				validatedByUser: { connect: { id: "admin_123" } },
			}),
		);
		expect(mailService.sendHotelBookingCancelledMail).toHaveBeenCalledWith({
			locale: "en",
			to: "grace@example.com",
			variables: {
				bookingReference: "booking_456",
				cancelReason: "No availability left for these dates",
				checkInDate: "2026-06-10T00:00:00.000Z",
				checkOutDate: "2026-06-12T00:00:00.000Z",
				guestCount: 3,
				guestName: "Grace Hopper",
				hotelName: "Lagoon Retreat",
				priceLabel: expect.any(String),
				roomTitle: "Family Villa",
				specialRequests: "Vegetarian breakfast if possible",
				supportEmail: "contact@zanadeal.com",
			},
		});
		expect(result).toMatchObject({
			bookingId: "booking_456",
			decision: "REJECT",
			status: BookingStatus.REJECTED,
		});
	});

	it("returns the current booking state when the same decision is replayed", async () => {
		vi.mocked(getBookingByPaymentAttemptId).mockResolvedValue({
			id: "booking_789",
			paymentAttemptId: "pay_789",
			status: BookingStatus.CONFIRMED,
		} as never);

		const result = await reviewBookingRequest({
			actorUserId: "admin_123",
			decision: "ACCEPT",
			paymentAttemptId: "pay_789",
		});

		expect(getPaymentAttemptById).not.toHaveBeenCalled();
		expect(updateBookingInDb).not.toHaveBeenCalled();
		expect(result).toEqual({
			bookingId: "booking_789",
			decision: "ACCEPT",
			status: BookingStatus.CONFIRMED,
		});
	});

	it("fails when the booking was already decided differently", async () => {
		vi.mocked(getBookingByPaymentAttemptId).mockResolvedValue({
			id: "booking_999",
			paymentAttemptId: "pay_999",
			status: BookingStatus.REJECTED,
		} as never);

		await expect(
			reviewBookingRequest({
				actorUserId: "admin_123",
				decision: "ACCEPT",
				paymentAttemptId: "pay_999",
			}),
		).rejects.toThrow("Booking request has already been reviewed");
	});

	it("surfaces provider failures before mutating the booking decision", async () => {
		vi.mocked(getBookingByPaymentAttemptId).mockResolvedValue({
			id: "booking_321",
			paymentAttemptId: "pay_321",
			status: BookingStatus.PENDING_VALIDATION,
		} as never);
		vi.mocked(getPaymentAttemptById).mockResolvedValue({
			id: "pay_321",
			provider: PaymentProvider.STRIPE,
			providerReference: "cs_test_321",
			providerStatus: "complete",
			transactionId: "pi_321",
			quote: {
				id: "quote_321",
				userId: "user_123",
			},
		} as never);
		const captureAuthorizedPayment = vi
			.fn()
			.mockRejectedValue(
				new PaymentProviderError(
					"capture_failed",
					"Stripe capture failed",
				),
			);
		vi.mocked(getPaymentProviderOrThrow).mockReturnValue({
			captureAuthorizedPayment,
			provider: PaymentProvider.STRIPE,
			startPayment: vi.fn(),
		} as never);

		await expect(
			reviewBookingRequest({
				actorUserId: "admin_123",
				decision: "ACCEPT",
				paymentAttemptId: "pay_321",
			}),
		).rejects.toThrow("Stripe capture failed");

		expect(updateBookingInDb).not.toHaveBeenCalled();
		expect(updatePaymentAttemptInDb).not.toHaveBeenCalled();
	});
});