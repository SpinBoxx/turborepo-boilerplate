import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentAttemptStatus, PaymentProvider } from "../../../../db/prisma/generated/enums";
import { getBookingQuote } from "../booking-quote/booking-quote.store";
import { getPaymentProviderOrThrow } from "./providers/payment-provider-registry";
import { PaymentProviderError } from "./providers/payment-provider.types";
import { buildStripeEmbeddedCheckoutSessionParams } from "./providers/stripe/stripe-payment.provider";
import { createPaymentAttemptInDb, updatePaymentAttemptInDb } from "./payment.store";
import { startPayment } from "./payment.service";

vi.mock("../booking-quote/booking-quote.store", () => ({
	getBookingQuote: vi.fn(),
}));

vi.mock("./payment.store", () => ({
	createPaymentAttemptInDb: vi.fn(),
	updatePaymentAttemptInDb: vi.fn(),
}));

vi.mock("./providers/payment-provider-registry", () => ({
	getPaymentProviderOrThrow: vi.fn(),
}));

describe("payment.service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("builds embedded checkout params for a booking quote", () => {
		const params = buildStripeEmbeddedCheckoutSessionParams({
			paymentAttemptId: "payment_attempt_123",
			quote: {
				id: "quote_123",
				hotelId: "hotel_123",
				roomId: "room_123",
				currency: "MGA",
				totalAmount: 125000,
				customerEmail: "traveler@example.com",
				roomTitle: "Ocean Suite",
				quantity: 1,
			} as const,
			returnUrl: "https://zanadeal.test/checkout/return?session_id={CHECKOUT_SESSION_ID}",
		});

		expect(params.ui_mode).toBe("embedded_page");
		expect(params.mode).toBe("payment");
		expect(params.customer_email).toBe("traveler@example.com");
		expect(params.return_url).toBe(
			"https://zanadeal.test/checkout/return?session_id={CHECKOUT_SESSION_ID}",
		);
		expect(params.payment_intent_data?.capture_method).toBe("manual");
		expect(params.metadata).toEqual({
			paymentAttemptId: "payment_attempt_123",
			quoteId: "quote_123",
			hotelId: "hotel_123",
			roomId: "room_123",
		});
		expect(params.line_items).toEqual([
			{
				price_data: {
					currency: "mga",
					product_data: {
						name: "Ocean Suite",
					},
					unit_amount: 1250,
				},
				quantity: 1,
			},
		]);
	});

	it("keeps stored x100 amounts for two-decimal currencies", () => {
		const params = buildStripeEmbeddedCheckoutSessionParams({
			paymentAttemptId: "payment_attempt_456",
			quote: {
				id: "quote_456",
				hotelId: "hotel_456",
				roomId: "room_456",
				currency: "USD",
				totalAmount: 1234,
				customerEmail: "traveler@example.com",
				roomTitle: "City Loft",
				quantity: 2,
			} as const,
			returnUrl: "https://zanadeal.test/checkout/return?session_id={CHECKOUT_SESSION_ID}",
		});

		expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(1234);
	});

	it("returns a recoverable bad request when Stripe rejects a too-small amount", async () => {
		vi.mocked(getBookingQuote).mockResolvedValue({
			currency: "MGA",
			expiresAt: new Date(Date.now() + 60_000),
			id: "quote_123",
			room: {
				images: [],
				prices: [],
				title: "Ocean Suite",
				type: "SUITE",
			},
			status: "ACTIVE",
			totalAmount: 125000,
			userId: "user_123",
		} as never);
		vi.mocked(createPaymentAttemptInDb).mockResolvedValue({
			id: "payment_attempt_123",
		} as never);
		vi.mocked(updatePaymentAttemptInDb).mockResolvedValue({
			id: "payment_attempt_123",
			status: PaymentAttemptStatus.FAILED,
		} as never);
		vi.mocked(getPaymentProviderOrThrow).mockReturnValue({
			provider: PaymentProvider.STRIPE,
			startPayment: vi.fn().mockRejectedValue(
				new PaymentProviderError(
					"amount_too_small",
					"The booking total is below Stripe's minimum amount for card payments.",
				),
			),
		} as never);

		await expect(
			startPayment({
				provider: PaymentProvider.STRIPE,
				quoteId: "quote_123",
				userId: "user_123",
			}),
		).rejects.toMatchObject({
			code: "BAD_REQUEST",
			message:
				"The booking total is below Stripe's minimum amount for card payments.",
		});
	});
});