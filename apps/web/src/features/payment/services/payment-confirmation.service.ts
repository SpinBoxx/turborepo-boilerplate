import type { GetPaymentStatusResult } from "@zanadeal/api/features/payment";

export type PaymentConfirmationViewState =
	| "pending-hotel-approval"
	| "request-submission-delayed"
	| "request-submission-processing"
	| "payment-action-required"
	| "payment-failed";

export function getPaymentConfirmationViewState(
	paymentStatus: GetPaymentStatusResult,
): PaymentConfirmationViewState {
	if (paymentStatus.attemptStatus === "FAILED") {
		return "payment-failed";
	}

	if (
		paymentStatus.provider === "STRIPE" &&
		paymentStatus.providerSessionStatus === "open"
	) {
		return "payment-action-required";
	}

	if (paymentStatus.hotelBookingRequestNotificationStatus === "FAILED") {
		return "request-submission-delayed";
	}

	if (
		paymentStatus.hotelBookingRequestNotificationStatus === "PENDING" ||
		paymentStatus.hotelBookingRequestNotificationStatus === "PROCESSING"
	) {
		return "request-submission-processing";
	}

	return "pending-hotel-approval";
}