interface CheckoutRouteRecoveryInput {
	paymentAttemptId?: string;
	quoteId: string;
}

interface ShouldRedirectExpiredQuoteBeforePaymentInput {
	expiresAt: Date;
	hasPaymentAttemptId: boolean;
	now?: Date;
	quoteStatus: string;
}

export function getCheckoutRouteRecoveryRedirect({
	paymentAttemptId,
}: CheckoutRouteRecoveryInput) {
	if (paymentAttemptId) {
		return null;
	}

	return { to: "/review-cart-checkout" } as const;
}

export function shouldRedirectExpiredQuoteBeforePayment({
	expiresAt,
	hasPaymentAttemptId,
	now = new Date(),
	quoteStatus,
}: ShouldRedirectExpiredQuoteBeforePaymentInput) {
	if (hasPaymentAttemptId) {
		return false;
	}

	return quoteStatus !== "ACTIVE" || expiresAt <= now;
}