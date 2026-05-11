import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey =
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";

export const stripePromise = stripePublishableKey
	? loadStripe(stripePublishableKey)
	: Promise.resolve(null);

export function hasStripePublishableKey() {
	return stripePublishableKey.length > 0;
}

function isLocalhostHostname(hostname: string) {
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "[::1]"
	);
}

export function getStripeEmbeddedCheckoutSecurityIssue() {
	if (typeof window === "undefined") {
		return null;
	}

	if (window.isSecureContext) {
		return null;
	}

	const { hostname, href, protocol } = window.location;

	if (protocol === "http:" && isLocalhostHostname(hostname)) {
		return null;
	}

	return {
		currentUrl: href,
		hostname,
		message:
			"Stripe Embedded Checkout requires a secure page. Open this checkout on https or on localhost instead of a local network URL.",
	};
}