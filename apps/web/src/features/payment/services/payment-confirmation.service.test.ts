import { describe, expect, it } from "vitest";
import { getPaymentConfirmationViewState } from "./payment-confirmation.service";

describe("payment-confirmation.service", () => {
	it("returns pending hotel approval for completed Stripe checkout", () => {
		expect(
			getPaymentConfirmationViewState({
				attemptStatus: "PROCESSING",
				hotelBookingRequestNotificationStatus: null,
				paymentAttemptId: "attempt_123",
				provider: "STRIPE",
				providerPaymentStatus: "paid",
				providerSessionStatus: "complete",
				providerStatus: "complete",
			}),
		).toBe("pending-hotel-approval");
	});

	it("returns action required when Stripe session is still open", () => {
		expect(
			getPaymentConfirmationViewState({
				attemptStatus: "PENDING",
				hotelBookingRequestNotificationStatus: null,
				paymentAttemptId: "attempt_124",
				provider: "STRIPE",
				providerPaymentStatus: "unpaid",
				providerSessionStatus: "open",
				providerStatus: "open",
			}),
		).toBe("payment-action-required");
	});

	it("returns failed when the payment attempt failed", () => {
		expect(
			getPaymentConfirmationViewState({
				attemptStatus: "FAILED",
				hotelBookingRequestNotificationStatus: null,
				paymentAttemptId: "attempt_125",
				provider: "STRIPE",
				providerPaymentStatus: "unpaid",
				providerSessionStatus: "expired",
				providerStatus: "expired",
			}),
		).toBe("payment-failed");
	});

	it("flags delayed notification dispatch separately from payment failures", () => {
		expect(
			getPaymentConfirmationViewState({
				attemptStatus: "SUCCEEDED",
				hotelBookingRequestNotificationStatus: "FAILED",
				paymentAttemptId: "pay_123",
				provider: "STRIPE",
				providerPaymentStatus: "paid",
				providerSessionStatus: "complete",
				providerStatus: "complete",
			}),
		).toBe("request-submission-delayed");

		expect(
			getPaymentConfirmationViewState({
				attemptStatus: "PROCESSING",
				hotelBookingRequestNotificationStatus: "PENDING",
				paymentAttemptId: "pay_456",
				provider: "STRIPE",
				providerPaymentStatus: "paid",
				providerSessionStatus: "complete",
				providerStatus: "complete",
			}),
		).toBe("request-submission-processing");
	});
});