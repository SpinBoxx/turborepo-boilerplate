import type { PaymentProvider } from "../../../../../db/prisma/generated/enums";
import type { BookingQuoteDB } from "../../booking-quote/booking-quote.store";
import type { StartPaymentResult } from "../payment.schemas";

export interface StartProviderPaymentInput {
	paymentAttemptId: string;
	quote: BookingQuoteDB;
}

export interface ProviderPaymentPersistenceFields {
	providerReference?: string | null;
	providerStatus?: string | null;
	transactionId?: string | null;
	redirectUrl?: string | null;
	callbackPayload?: unknown;
}

export interface PaymentAttemptStatusSnapshot {
	id: string;
	providerReference: string | null;
	providerStatus: string | null;
	transactionId: string | null;
}

export interface GetProviderPaymentStatusInput {
	paymentAttempt: PaymentAttemptStatusSnapshot;
}

export interface ReviewProviderPaymentInput {
	paymentAttempt: PaymentAttemptStatusSnapshot;
}

export interface ProviderPaymentStatusOutput {
	providerSessionStatus?: string | null;
	providerPaymentStatus?: string | null;
}

export interface ReviewProviderPaymentOutput {
	providerStatus?: string | null;
	transactionId?: string | null;
}

export interface StartProviderPaymentOutput {
	publicResult: StartPaymentResult;
	persistence: ProviderPaymentPersistenceFields;
}

export interface PaymentProviderHandler {
	provider: PaymentProvider;
	startPayment(
		input: StartProviderPaymentInput,
	): Promise<StartProviderPaymentOutput>;
	captureAuthorizedPayment?(
		input: ReviewProviderPaymentInput,
	): Promise<ReviewProviderPaymentOutput>;
	cancelAuthorizedPayment?(
		input: ReviewProviderPaymentInput,
	): Promise<ReviewProviderPaymentOutput>;
	getPaymentStatus?(
		input: GetProviderPaymentStatusInput,
	): Promise<ProviderPaymentStatusOutput>;
}

export class PaymentProviderError extends Error {
	readonly code: string;
	readonly details?: unknown;

	constructor(code: string, message: string, details?: unknown) {
		super(message);
		this.name = "PaymentProviderError";
		this.code = code;
		this.details = details;
	}
}