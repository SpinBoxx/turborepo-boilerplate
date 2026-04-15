import { describe, expect, it } from "vitest";
import {
	getCheckoutPaymentMethodOptions,
	getStripePaymentViewState,
} from "./payment-ui.service";

describe("payment-ui.service", () => {
	it("keeps Stripe enabled and Orange Money disabled for now", () => {
		const methods = getCheckoutPaymentMethodOptions();

		expect(methods).toEqual([
			{
				badge: "Recommended",
				description: "Pay securely with your bank card through Stripe.",
				enabled: true,
				provider: "STRIPE",
				title: "Bank card",
			},
			{
				badge: "Soon",
				description:
					"Orange Money will be available here with the same checkout flow.",
				enabled: false,
				provider: "ORANGE_MONEY",
				title: "Orange Money",
			},
		]);
	});

	it("maps a completed Stripe session to the authorized view state", () => {
		expect(
			getStripePaymentViewState({
				attemptStatus: "PROCESSING",
				hotelBookingRequestNotificationStatus: null,
				paymentAttemptId: "payment_123",
				provider: "STRIPE",
				providerPaymentStatus: "unpaid",
				providerSessionStatus: "complete",
				providerStatus: "open",
			}),
		).toBe("authorized");
	});

	it("maps an open Stripe session to a retryable state", () => {
		expect(
			getStripePaymentViewState({
				attemptStatus: "PROCESSING",
				hotelBookingRequestNotificationStatus: null,
				paymentAttemptId: "payment_123",
				provider: "STRIPE",
				providerPaymentStatus: "unpaid",
				providerSessionStatus: "open",
				providerStatus: "open",
			}),
		).toBe("retry_required");
	});

	it("maps a failed Stripe attempt to the failed state", () => {
		expect(
			getStripePaymentViewState({
				attemptStatus: "FAILED",
				hotelBookingRequestNotificationStatus: null,
				paymentAttemptId: "payment_123",
				provider: "STRIPE",
				providerPaymentStatus: null,
				providerSessionStatus: null,
				providerStatus: "session_creation_failed",
			}),
		).toBe("failed");
	});
});