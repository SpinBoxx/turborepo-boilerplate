import { ORPCError } from "@orpc/server";
import { PaymentProvider } from "../../../../../db/prisma/generated/enums";
import type { PaymentProviderHandler } from "./payment-provider.types";
import { stripePaymentProvider } from "./stripe/stripe-payment.provider";

const paymentProviders = new Map<PaymentProvider, PaymentProviderHandler>([
	[PaymentProvider.STRIPE, stripePaymentProvider],
]);

export function getPaymentProviderOrThrow(provider: PaymentProvider) {
	const paymentProvider = paymentProviders.get(provider);

	if (!paymentProvider) {
		throw new ORPCError("BAD_REQUEST", {
			message: `Payment provider ${provider} is not supported yet`,
		});
	}

	return paymentProvider;
}