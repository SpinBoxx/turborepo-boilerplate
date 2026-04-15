import { describe, expect, it, vi, beforeEach } from "vitest";
import { PaymentProvider } from "../../../../db/prisma/generated/enums";
import { finalizeStripeCheckoutSession } from "./payment-finalization.service";
import { handleStripeCheckoutSessionCompletedWebhook } from "./payment-webhook.service";
import { getPaymentAttemptById } from "./payment.store";

vi.mock("./payment.store", () => ({
	getPaymentAttemptById: vi.fn(),
}));

vi.mock("./payment-finalization.service", () => ({
	finalizeStripeCheckoutSession: vi.fn(),
}));

describe("payment-webhook.service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("syncs a Stripe checkout session completion by paymentAttemptId", async () => {
		vi.mocked(getPaymentAttemptById).mockResolvedValue({
			id: "payment_attempt_123",
			provider: PaymentProvider.STRIPE,
			providerReference: "cs_test_123",
			quote: {
				id: "quote_123",
				userId: "user_123",
			},
		} as never);
		vi.mocked(finalizeStripeCheckoutSession).mockResolvedValue({
			attemptStatus: "SUCCEEDED",
			hotelEmailStatus: "sent",
			providerStatus: "complete",
		});

		const result = await handleStripeCheckoutSessionCompletedWebhook({
			paymentAttemptId: "payment_attempt_123",
			providerPaymentStatus: "paid",
			providerSessionId: "cs_test_123",
			providerSessionStatus: "complete",
		});

		expect(result).toEqual({ handled: true, hotelEmailStatus: "sent" });

		expect(finalizeStripeCheckoutSession).toHaveBeenCalledWith({
			logger: undefined,
			paymentAttempt: expect.objectContaining({
				id: "payment_attempt_123",
			}),
			providerPaymentStatus: "paid",
			providerSessionStatus: "complete",
			userId: "user_123",
		});
	});

	it("ignores a Stripe webhook when the session id does not match the stored attempt", async () => {
		vi.mocked(getPaymentAttemptById).mockResolvedValue({
			id: "payment_attempt_123",
			provider: PaymentProvider.STRIPE,
			providerReference: "cs_test_expected",
			quote: {
				id: "quote_123",
				userId: "user_123",
			},
		} as never);

		const result = await handleStripeCheckoutSessionCompletedWebhook({
			paymentAttemptId: "payment_attempt_123",
			providerPaymentStatus: "paid",
			providerSessionId: "cs_test_other",
			providerSessionStatus: "complete",
		});

		expect(result).toEqual({ handled: false, reason: "provider_reference_mismatch" });
		expect(finalizeStripeCheckoutSession).not.toHaveBeenCalled();
	});
});