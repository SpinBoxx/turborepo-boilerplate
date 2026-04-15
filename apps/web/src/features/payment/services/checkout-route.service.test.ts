import { describe, expect, it } from "vitest";
import {
	getCheckoutRouteRecoveryRedirect,
	shouldRedirectExpiredQuoteBeforePayment,
} from "./checkout-route.service";

describe("checkout-route.service", () => {
	it("does not redirect back into a fresh checkout when a payment attempt already exists", () => {
		expect(
			getCheckoutRouteRecoveryRedirect({
				paymentAttemptId: "pay_123",
				quoteId: "quote_123",
			}),
		).toBeNull();
	});

	it("redirects to the review cart flow when checkout data cannot be loaded before payment starts", () => {
		expect(
			getCheckoutRouteRecoveryRedirect({
				quoteId: "quote_123",
			}),
		).toEqual({ to: "/review-cart-checkout" });
	});

	it("only forces the user back to review before payment when the quote is inactive or expired", () => {
		expect(
			shouldRedirectExpiredQuoteBeforePayment({
				expiresAt: new Date("2026-04-16T10:05:00.000Z"),
				hasPaymentAttemptId: false,
				now: new Date("2026-04-16T10:00:00.000Z"),
				quoteStatus: "ACTIVE",
			}),
		).toBe(false);

		expect(
			shouldRedirectExpiredQuoteBeforePayment({
				expiresAt: new Date("2026-04-16T09:55:00.000Z"),
				hasPaymentAttemptId: false,
				now: new Date("2026-04-16T10:00:00.000Z"),
				quoteStatus: "ACTIVE",
			}),
		).toBe(true);

		expect(
			shouldRedirectExpiredQuoteBeforePayment({
				expiresAt: new Date("2026-04-16T10:05:00.000Z"),
				hasPaymentAttemptId: false,
				now: new Date("2026-04-16T10:00:00.000Z"),
				quoteStatus: "CONVERTED",
			}),
		).toBe(true);

		expect(
			shouldRedirectExpiredQuoteBeforePayment({
				expiresAt: new Date("2026-04-16T09:55:00.000Z"),
				hasPaymentAttemptId: true,
				now: new Date("2026-04-16T10:00:00.000Z"),
				quoteStatus: "ACTIVE",
			}),
		).toBe(false);
	});
});
