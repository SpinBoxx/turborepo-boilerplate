import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPaymentStatus } from "./payment-query.service";
import { getLatestHotelBookingRequestNotificationByPaymentAttemptId } from "./payment-notification.store";
import { getPaymentProviderOrThrow } from "./providers/payment-provider-registry";
import { getPaymentAttemptById } from "./payment.store";

vi.mock("./payment.store", () => ({
	getPaymentAttemptById: vi.fn(),
}));

vi.mock("./payment-notification.store", () => ({
	getLatestHotelBookingRequestNotificationByPaymentAttemptId: vi.fn(),
}));

vi.mock("./providers/payment-provider-registry", () => ({
	getPaymentProviderOrThrow: vi.fn(),
}));

describe("payment-query.service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns the latest hotel notification status with provider status details", async () => {
		vi.mocked(getPaymentAttemptById).mockResolvedValue({
			id: "payment_attempt_123",
			provider: "STRIPE",
			providerReference: "cs_test_123",
			providerStatus: "complete",
			quote: {
				id: "quote_123",
				userId: "user_123",
			},
			status: "SUCCEEDED",
		} as never);
		vi.mocked(getLatestHotelBookingRequestNotificationByPaymentAttemptId).mockResolvedValue({
			status: "SENT",
		} as never);
		vi.mocked(getPaymentProviderOrThrow).mockReturnValue({
			getPaymentStatus: vi.fn().mockResolvedValue({
				providerPaymentStatus: "paid",
				providerSessionStatus: "complete",
			}),
		} as never);

		const result = await getPaymentStatus({
			paymentAttemptId: "payment_attempt_123",
			userId: "user_123",
		});

		expect(result).toEqual({
			attemptStatus: "SUCCEEDED",
			hotelBookingRequestNotificationStatus: "SENT",
			paymentAttemptId: "payment_attempt_123",
			provider: "STRIPE",
			providerPaymentStatus: "paid",
			providerSessionStatus: "complete",
			providerStatus: "complete",
		});
	});
});