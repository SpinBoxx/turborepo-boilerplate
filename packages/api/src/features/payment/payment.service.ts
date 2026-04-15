import { ORPCError } from "@orpc/server";
import {
	BookingQuoteStatus,
	PaymentAttemptStatus,
} from "../../../../db/prisma/generated/enums";
import type { PaymentProvider } from "../../../../db/prisma/generated/enums";
import type { LoggerLike } from "../../context";
import { getBookingQuote } from "../booking-quote/booking-quote.store";
import type { StartPaymentResult } from "./payment.schemas";
import {
	toPrismaJsonPropertyValue,
	toPrismaJsonValue,
} from "./payment-json.service";
import { getPaymentProviderOrThrow } from "./providers/payment-provider-registry";
import { PaymentProviderError } from "./providers/payment-provider.types";
import {
	createPaymentAttemptInDb,
	updatePaymentAttemptInDb,
} from "./payment.store";

export interface StartPaymentInput {
	quoteId: string;
	provider: PaymentProvider;
	userId: string;
	logger?: LoggerLike;
}

function toPublicStartPaymentError(
	provider: PaymentProvider,
	providerError: PaymentProviderError,
) {
	if (provider === "STRIPE" && providerError.code === "amount_too_small") {
		return new ORPCError("BAD_REQUEST", {
			message:
				"The booking total is below Stripe's minimum amount for card payments.",
		});
	}

	if (provider === "STRIPE" && providerError.code === "invalid_amount") {
		return new ORPCError("BAD_REQUEST", {
			message:
				"This booking total is not compatible with Stripe for the selected currency.",
		});
	}

	return new ORPCError("INTERNAL_SERVER_ERROR", {
		message: `Unable to start ${provider} payment session`,
	});
}

export async function startPayment({
	quoteId,
	provider,
	userId,
	logger,
}: StartPaymentInput): Promise<StartPaymentResult> {
	const quote = await getBookingQuote(quoteId);

	if (!quote || quote.userId !== userId) {
		throw new ORPCError("NOT_FOUND");
	}

	if (quote.status !== BookingQuoteStatus.ACTIVE) {
		throw new ORPCError("BAD_REQUEST", {
			message: "Only active quotes can start a payment",
		});
	}

	if (quote.expiresAt <= new Date()) {
		throw new ORPCError("BAD_REQUEST", {
			message: "This quote has expired",
		});
	}

	const paymentProvider = getPaymentProviderOrThrow(provider);

	const paymentAttempt = await createPaymentAttemptInDb({
		quote: { connect: { id: quote.id } },
		provider,
		status: PaymentAttemptStatus.PENDING,
		amount: quote.totalAmount,
		currency: quote.currency,
		events: {
			create: {
				type: "PAYMENT_ATTEMPT_CREATED",
				actorUser: { connect: { id: userId } },
				note: "Stripe embedded checkout session requested",
			},
		},
	});

	try {
		const providerResult = await paymentProvider.startPayment({
			paymentAttemptId: paymentAttempt.id,
			quote,
			logger,
		});

		await updatePaymentAttemptInDb(paymentAttempt.id, {
			status: PaymentAttemptStatus.PROCESSING,
			providerReference: providerResult.persistence.providerReference,
			providerStatus: providerResult.persistence.providerStatus,
			transactionId: providerResult.persistence.transactionId,
			redirectUrl: providerResult.persistence.redirectUrl,
			callbackPayload: toPrismaJsonValue(
				providerResult.persistence.callbackPayload,
			),
			events: {
				create: {
					type: "PAYMENT_PROCESSING",
					actorUser: { connect: { id: userId } },
					note: `${provider} payment session created`,
					metadata: {
						provider,
						providerSessionId:
							providerResult.persistence.providerReference ?? null,
					},
				},
			},
		});

		return providerResult.publicResult;
	} catch (error) {
		const providerError =
			error instanceof PaymentProviderError
				? error
				: new PaymentProviderError(
					"unknown_error",
					error instanceof Error
						? error.message
						: "Unknown payment provider error",
				);

		logger?.error?.(
			{
				paymentAttemptId: paymentAttempt.id,
				quoteId: quote.id,
				provider,
				providerError,
			},
			"Failed to start provider payment session",
		);

		await updatePaymentAttemptInDb(paymentAttempt.id, {
			status: PaymentAttemptStatus.FAILED,
			providerStatus: "session_creation_failed",
			failureCode: providerError.code,
			failureMessage: providerError.message,
			events: {
				create: {
					type: "PAYMENT_FAILED",
					actorUser: { connect: { id: userId } },
					note: `${provider} payment session creation failed`,
					metadata: {
						provider,
						code: providerError.code,
						details: toPrismaJsonPropertyValue(providerError.details) ?? null,
					},
				},
			},
		});

		throw toPublicStartPaymentError(provider, providerError);
	}
}