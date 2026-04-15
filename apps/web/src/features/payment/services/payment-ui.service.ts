import type { GetPaymentStatusResult } from "@zanadeal/api/features/payment";

export type CheckoutPaymentProvider = "STRIPE" | "ORANGE_MONEY";

export interface CheckoutPaymentMethodOption {
	badge: string | null;
	description: string;
	enabled: boolean;
	provider: CheckoutPaymentProvider;
	title: string;
}

export type StripePaymentViewState =
	| "authorized"
	| "failed"
	| "idle"
	| "processing"
	| "retry_required";

export function getCheckoutPaymentMethodOptions(): CheckoutPaymentMethodOption[] {
	return [
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
	];
}

export function getStripePaymentViewState(
	status: GetPaymentStatusResult | null,
): StripePaymentViewState {
	if (!status || status.provider !== "STRIPE") {
		return "idle";
	}

	if (
		status.providerSessionStatus === "complete" ||
		status.attemptStatus === "SUCCEEDED"
	) {
		return "authorized";
	}

	if (status.attemptStatus === "FAILED") {
		return "failed";
	}

	if (
		status.providerSessionStatus === "open" ||
		status.providerSessionStatus === "expired"
	) {
		return "retry_required";
	}

	return "processing";
}