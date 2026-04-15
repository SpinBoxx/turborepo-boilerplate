import { PaymentProvider } from "../../../../db/prisma/generated/enums";
import type { LoggerLike } from "../../context";
import { finalizeStripeCheckoutSession } from "./payment-finalization.service";
import { getPaymentAttemptById } from "./payment.store";
import type { HotelBookingRequestEmailStatus } from "./payment-notification.service";

export interface HandleStripeCheckoutSessionCompletedWebhookInput {
	logger?: LoggerLike;
	paymentAttemptId: string;
	providerPaymentStatus: string | null;
	providerSessionId: string;
	providerSessionStatus: string | null;
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
	logger,
	paymentAttemptId,
	providerPaymentStatus,
	providerSessionId,
	providerSessionStatus,
}: HandleStripeCheckoutSessionCompletedWebhookInput): Promise<HandleStripeCheckoutSessionCompletedWebhookResult> {
	const paymentAttempt = await getPaymentAttemptById(paymentAttemptId);

	if (!paymentAttempt) {
		logger?.warn?.(
			{ paymentAttemptId, providerSessionId },
			"Stripe webhook ignored because the payment attempt could not be found",
		);

		return { handled: false, reason: "missing_payment_attempt" };
	}

	if (paymentAttempt.provider !== PaymentProvider.STRIPE) {
		logger?.warn?.(
			{
				paymentAttemptId,
				provider: paymentAttempt.provider,
				providerSessionId,
			},
			"Stripe webhook ignored because the payment attempt provider does not match",
		);

		return { handled: false, reason: "provider_mismatch" };
	}

	if (
		paymentAttempt.providerReference &&
		paymentAttempt.providerReference !== providerSessionId
	) {
		logger?.warn?.(
			{
				expectedProviderReference: paymentAttempt.providerReference,
				paymentAttemptId,
				providerSessionId,
			},
			"Stripe webhook ignored because the provider session id does not match the stored attempt",
		);

		return { handled: false, reason: "provider_reference_mismatch" };
	}

	const finalizationResult = await finalizeStripeCheckoutSession({
		logger,
		paymentAttempt,
		providerPaymentStatus,
		providerSessionStatus,
		userId: paymentAttempt.quote.userId ?? undefined,
	});

	logger?.info?.(
		{
			hotelEmailStatus: finalizationResult?.hotelEmailStatus,
			paymentAttemptId,
			providerSessionId,
			providerSessionStatus,
		},
		"Stripe webhook processed payment attempt",
	);

	return { handled: true, hotelEmailStatus: finalizationResult?.hotelEmailStatus };
}
