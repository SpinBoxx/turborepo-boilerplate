import { ORPCError } from "@orpc/server";
import type { LoggerLike } from "../../context";
import type { GetPaymentStatusResult } from "./payment.schemas";
import {
	getLatestHotelBookingRequestNotificationByPaymentAttemptId,
} from "./payment-notification.store";
import { getPaymentProviderOrThrow } from "./providers/payment-provider-registry";
import { getPaymentAttemptById } from "./payment.store";

export interface GetPaymentStatusInput {
	paymentAttemptId: string;
	userId: string;
	logger?: LoggerLike;
}

export async function getPaymentStatus({
	paymentAttemptId,
	userId,
	logger,
}: GetPaymentStatusInput): Promise<GetPaymentStatusResult> {
	const paymentAttempt = await getPaymentAttemptById(paymentAttemptId);

	if (!paymentAttempt || paymentAttempt.quote.userId !== userId) {
		throw new ORPCError("NOT_FOUND");
	}

	const [notification, providerStatus] = await Promise.all([
		getLatestHotelBookingRequestNotificationByPaymentAttemptId(paymentAttempt.id),
		(async () => {
			const paymentProvider = getPaymentProviderOrThrow(paymentAttempt.provider);

			return paymentProvider.getPaymentStatus
				? await paymentProvider.getPaymentStatus({
						paymentAttempt: {
							id: paymentAttempt.id,
							providerReference: paymentAttempt.providerReference,
							providerStatus: paymentAttempt.providerStatus,
						},
						logger,
					})
				: {
						providerSessionStatus: null,
						providerPaymentStatus: null,
					};
		})(),
	]);

	return {
		paymentAttemptId: paymentAttempt.id,
		provider: paymentAttempt.provider,
		attemptStatus: paymentAttempt.status,
		providerStatus: paymentAttempt.providerStatus,
		providerSessionStatus: providerStatus.providerSessionStatus ?? null,
		providerPaymentStatus: providerStatus.providerPaymentStatus ?? null,
		hotelBookingRequestNotificationStatus: notification?.status ?? null,
	};
}