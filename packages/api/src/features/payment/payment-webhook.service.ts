import { PaymentProvider } from "../../../../db/prisma/generated/enums";
import { finalizeStripeCheckoutSession } from "./payment-finalization.service";
import { getPaymentAttemptById } from "./payment.store";
import type { HotelBookingRequestEmailStatus } from "./payment-notification.service";

export interface HandleStripeCheckoutSessionCompletedWebhookInput {
	paymentAttemptId: string;
	providerPaymentStatus: string | null;
	providerSessionId: string;
	providerSessionStatus: string | null;
	transactionId?: string | null;
}

export interface HandleStripeCheckoutSessionCompletedWebhookResult {
	handled: boolean;
	hotelEmailStatus?: HotelBookingRequestEmailStatus;
	reason?:
		| "missing_payment_attempt"
		| "provider_mismatch"
		| "provider_reference_mismatch";
}

export async function handleStripeCheckoutSessionCompletedWebhook({
	paymentAttemptId,
	providerPaymentStatus,
	providerSessionId,
	providerSessionStatus,
	transactionId,
}: HandleStripeCheckoutSessionCompletedWebhookInput): Promise<HandleStripeCheckoutSessionCompletedWebhookResult> {
	const paymentAttempt = await getPaymentAttemptById(paymentAttemptId);

	if (!paymentAttempt) {
		console.warn("Stripe webhook ignored because the payment attempt could not be found", {
			paymentAttemptId,
			providerSessionId,
		});

		return { handled: false, reason: "missing_payment_attempt" };
	}

	if (paymentAttempt.provider !== PaymentProvider.STRIPE) {
		console.warn("Stripe webhook ignored because the payment attempt provider does not match", {
			paymentAttemptId,
			provider: paymentAttempt.provider,
			providerSessionId,
		});

		return { handled: false, reason: "provider_mismatch" };
	}

	if (
		paymentAttempt.providerReference &&
		paymentAttempt.providerReference !== providerSessionId
	) {
		console.warn("Stripe webhook ignored because the provider session id does not match the stored attempt", {
			expectedProviderReference: paymentAttempt.providerReference,
			paymentAttemptId,
			providerSessionId,
		});

		return { handled: false, reason: "provider_reference_mismatch" };
	}

	const finalizationResult = await finalizeStripeCheckoutSession({
		paymentAttempt,
		providerPaymentStatus,
		providerSessionStatus,
		transactionId,
		userId: paymentAttempt.quote.userId ?? undefined,
	});

	console.log("Stripe webhook processed payment attempt", {
		hotelEmailStatus: finalizationResult?.hotelEmailStatus,
		paymentAttemptId,
		providerSessionId,
		providerSessionStatus,
	});

	return { handled: true, hotelEmailStatus: finalizationResult?.hotelEmailStatus };
}
