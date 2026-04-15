import Stripe from "stripe";
import z from "zod";
import { PaymentProvider } from "../../../../../../db/prisma/generated/enums";
import type {
	GetProviderPaymentStatusInput,
	PaymentProviderHandler,
	StartProviderPaymentInput,
} from "../payment-provider.types";
import { PaymentProviderError } from "../payment-provider.types";

export interface EmbeddedCheckoutQuoteSnapshot {
	id: string;
	hotelId: string;
	roomId: string;
	currency: string;
	totalAmount: number;
	customerEmail: string;
	roomTitle: string;
	quantity: number;
}

export interface BuildStripeEmbeddedCheckoutSessionParamsInput {
	paymentAttemptId: string;
	quote: EmbeddedCheckoutQuoteSnapshot;
	returnUrl: string;
}

const STRIPE_ZERO_DECIMAL_CURRENCIES = new Set([
	"BIF",
	"CLP",
	"DJF",
	"GNF",
	"JPY",
	"KMF",
	"KRW",
	"MGA",
	"PYG",
	"RWF",
	"UGX",
	"VND",
	"VUV",
	"XAF",
	"XOF",
	"XPF",
]);

const stripeConfigSchema = z.object({
	STRIPE_SECRET_KEY: z.string().min(1),
	CLIENT_URL: z.url(),
});

let stripeClient: Stripe | null = null;

export function toStripeAmount(amount: number, currency: string) {
	const normalizedCurrency = currency.toUpperCase();

	if (!STRIPE_ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency)) {
		return amount;
	}

	if (amount % 100 !== 0) {
		throw new PaymentProviderError(
			"invalid_amount",
			`Stored amount ${amount} is not compatible with Stripe zero-decimal currency ${normalizedCurrency}`,
		);
	}

	return amount / 100;
}

function getStripeConfig(processEnv: NodeJS.ProcessEnv = process.env) {
	const parsed = stripeConfigSchema.safeParse(processEnv);

	if (!parsed.success) {
		throw new PaymentProviderError(
			"missing_config",
			"Stripe payment configuration is missing",
			parsed.error.flatten(),
		);
	}

	return {
		secretKey: parsed.data.STRIPE_SECRET_KEY,
		clientUrl: parsed.data.CLIENT_URL,
	};
	}

function getStripeClient(processEnv: NodeJS.ProcessEnv = process.env) {
	if (stripeClient) {
		return stripeClient;
	}

	const { secretKey } = getStripeConfig(processEnv);
	stripeClient = new Stripe(secretKey);

	return stripeClient;
}

function buildStripeCheckoutReturnUrl(
	clientUrl: string,
	quoteId: string,
	paymentAttemptId: string,
) {
	const returnUrl = new URL("/checkout", clientUrl);
	returnUrl.searchParams.set("quoteId", quoteId);
	returnUrl.searchParams.set("paymentAttemptId", paymentAttemptId);
	returnUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
	return returnUrl.toString();
}

function getStripePaymentIntentId(
	paymentIntent: Stripe.Checkout.Session["payment_intent"],
) {
	if (!paymentIntent) {
		return null;
	}

	return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

function toPaymentProviderError(error: unknown) {
	if (error instanceof PaymentProviderError) {
		return error;
	}

	if (error instanceof Stripe.errors.StripeError) {
		return new PaymentProviderError(
			error.code ?? "stripe_error",
			error.message,
			{
				type: error.type,
			},
		);
	}

	if (error instanceof Error) {
		return new PaymentProviderError("unknown_error", error.message);
	}

	return new PaymentProviderError(
		"unknown_error",
		"Unknown Stripe error",
	);
}

export function buildStripeEmbeddedCheckoutSessionParams({
	paymentAttemptId,
	quote,
	returnUrl,
}: BuildStripeEmbeddedCheckoutSessionParamsInput) {
	return {
		ui_mode: "embedded_page" as const,
		mode: "payment" as const,
		customer_email: quote.customerEmail,
		return_url: returnUrl,
		line_items: [
			{
				price_data: {
					currency: quote.currency.toLowerCase(),
					product_data: {
						name: quote.roomTitle,
					},
					unit_amount: toStripeAmount(quote.totalAmount, quote.currency),
				},
				quantity: quote.quantity,
			},
		],
		payment_intent_data: {
			capture_method: "manual" as const,
			metadata: {
				paymentAttemptId,
				quoteId: quote.id,
				hotelId: quote.hotelId,
				roomId: quote.roomId,
			},
		},
		metadata: {
			paymentAttemptId,
			quoteId: quote.id,
			hotelId: quote.hotelId,
			roomId: quote.roomId,
		},
	};
}

async function startStripePayment({
	paymentAttemptId,
	quote,
}: StartProviderPaymentInput) {
	try {
		const { clientUrl } = getStripeConfig();
		const returnUrl = buildStripeCheckoutReturnUrl(
			clientUrl,
			quote.id,
			paymentAttemptId,
		);
		const session = await getStripeClient().checkout.sessions.create(
			buildStripeEmbeddedCheckoutSessionParams({
				paymentAttemptId,
				quote: {
					id: quote.id,
					hotelId: quote.hotelId,
					roomId: quote.roomId,
					currency: quote.currency,
					totalAmount: quote.totalAmount,
					customerEmail: quote.customerEmail,
					roomTitle: quote.room.title,
					quantity: quote.quantity,
				},
				returnUrl,
			}),
			{ idempotencyKey: paymentAttemptId },
		);

		if (!session.client_secret) {
			throw new PaymentProviderError(
				"missing_client_secret",
				"Stripe checkout session did not return a client secret",
			);
		}

		return {
			publicResult: {
				provider: PaymentProvider.STRIPE,
				flow: "EMBEDDED" as const,
				paymentAttemptId,
				providerSessionId: session.id,
				clientSecret: session.client_secret,
			},
			persistence: {
				providerReference: session.id,
				providerStatus: session.status ?? "open",
				transactionId: getStripePaymentIntentId(session.payment_intent),
				redirectUrl: returnUrl,
			},
		};
	} catch (error) {
		throw toPaymentProviderError(error);
	}
}

async function getStripePaymentStatus({
	paymentAttempt,
}: GetProviderPaymentStatusInput) {
	if (!paymentAttempt.providerReference) {
		return {
			providerSessionStatus: null,
			providerPaymentStatus: null,
		};
	}

	try {
		const session = await getStripeClient().checkout.sessions.retrieve(
			paymentAttempt.providerReference,
		);

		return {
			providerSessionStatus: session.status ?? null,
			providerPaymentStatus: session.payment_status ?? null,
		};
	} catch (error) {
		throw toPaymentProviderError(error);
	}
}

export const stripePaymentProvider: PaymentProviderHandler = {
	provider: PaymentProvider.STRIPE,
	startPayment: startStripePayment,
	getPaymentStatus: getStripePaymentStatus,
};