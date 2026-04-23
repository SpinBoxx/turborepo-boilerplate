import { beforeEach, describe, expect, it, vi } from "vitest";

const { stripeCtorMock, captureMock, cancelMock, retrieveMock } =
	vi.hoisted(() => {
		const captureMock = vi.fn();
		const cancelMock = vi.fn();
		const createMock = vi.fn();
		const retrieveMock = vi.fn();
		const stripeCtorMock = vi.fn().mockImplementation(() => ({
			checkout: {
				sessions: {
					create: createMock,
					retrieve: retrieveMock,
				},
			},
			paymentIntents: {
				cancel: cancelMock,
				capture: captureMock,
			},
		}));

		class StripeErrorMock extends Error {
			readonly code?: string;
			readonly type?: string;

			constructor(message: string, code?: string, type?: string) {
				super(message);
				this.name = "StripeError";
				this.code = code;
				this.type = type;
			}
		}

		Object.assign(stripeCtorMock, {
			errors: {
				StripeError: StripeErrorMock,
			},
		});

		return {
			cancelMock,
			captureMock,
			createMock,
			retrieveMock,
			stripeCtorMock,
		};
	});

vi.mock("stripe", () => ({
	default: stripeCtorMock,
}));

describe("stripe-payment.provider", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.STRIPE_SECRET_KEY = "sk_test_123";
		process.env.CLIENT_URL = "https://zanadeal.test";
	});

	it("captures the authorized payment intent when a booking is accepted", async () => {
		captureMock.mockResolvedValue({ status: "succeeded" });

		const { stripePaymentProvider } = await import("./stripe-payment.provider");

		await expect(
			stripePaymentProvider.captureAuthorizedPayment?.({
				paymentAttempt: {
					id: "pay_123",
					providerReference: "cs_test_123",
					providerStatus: "complete",
					transactionId: "pi_123",
				},
			}),
		).resolves.toEqual({
			providerStatus: "succeeded",
			transactionId: "pi_123",
		});

		expect(captureMock).toHaveBeenCalledWith("pi_123");
	});

	it("recovers the payment intent from the checkout session before capture when transactionId is missing", async () => {
		retrieveMock.mockResolvedValue({ payment_intent: "pi_recovered_123" });
		captureMock.mockResolvedValue({ status: "succeeded" });

		const { stripePaymentProvider } = await import("./stripe-payment.provider");

		await expect(
			stripePaymentProvider.captureAuthorizedPayment?.({
				paymentAttempt: {
					id: "pay_recover_123",
					providerReference: "cs_test_recover_123",
					providerStatus: "complete",
					transactionId: null,
				},
			}),
		).resolves.toEqual({
			providerStatus: "succeeded",
			transactionId: "pi_recovered_123",
		});

		expect(retrieveMock).toHaveBeenCalledWith("cs_test_recover_123");
		expect(captureMock).toHaveBeenCalledWith("pi_recovered_123");
	});

	it("cancels the authorized payment intent when a booking is rejected", async () => {
		cancelMock.mockResolvedValue({ status: "canceled" });

		const { stripePaymentProvider } = await import("./stripe-payment.provider");

		await expect(
			stripePaymentProvider.cancelAuthorizedPayment?.({
				paymentAttempt: {
					id: "pay_456",
					providerReference: "cs_test_456",
					providerStatus: "complete",
					transactionId: "pi_456",
				},
			}),
		).resolves.toEqual({
			providerStatus: "canceled",
			transactionId: "pi_456",
		});

		expect(cancelMock).toHaveBeenCalledWith("pi_456");
	});

	it("recovers the payment intent from the checkout session before cancellation when transactionId is missing", async () => {
		retrieveMock.mockResolvedValue({ payment_intent: "pi_recovered_456" });
		cancelMock.mockResolvedValue({ status: "canceled" });

		const { stripePaymentProvider } = await import("./stripe-payment.provider");

		await expect(
			stripePaymentProvider.cancelAuthorizedPayment?.({
				paymentAttempt: {
					id: "pay_recover_456",
					providerReference: "cs_test_recover_456",
					providerStatus: "complete",
					transactionId: null,
				},
			}),
		).resolves.toEqual({
			providerStatus: "canceled",
			transactionId: "pi_recovered_456",
		});

		expect(retrieveMock).toHaveBeenCalledWith("cs_test_recover_456");
		expect(cancelMock).toHaveBeenCalledWith("pi_recovered_456");
	});
});