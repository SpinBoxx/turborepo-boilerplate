import type { StartPaymentResult } from "@zanadeal/api/features/payment";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { startPayment } from "../payment.api";
import type { CheckoutPaymentProvider } from "../services/payment-ui.service";

type StripeStartPaymentResult = Extract<
	StartPaymentResult,
	{ provider: "STRIPE" }
>;

interface UseCheckoutPaymentInput {
	quoteId: string;
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Something went wrong while starting your payment.";
}

export function useCheckoutPayment({
	quoteId,
}: UseCheckoutPaymentInput) {
	const navigate = useNavigate();
	const [selectedProvider, setSelectedProvider] =
		useState<CheckoutPaymentProvider>("STRIPE");
	const [isStripeCheckoutOpen, setIsStripeCheckoutOpen] = useState(false);
	const [activeStripePayment, setActiveStripePayment] =
		useState<StripeStartPaymentResult | null>(null);
	const [isStartingPayment, setIsStartingPayment] = useState(false);
	const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(
		null,
	);
	const activeStripePaymentRef = useRef<StripeStartPaymentResult | null>(null);

	useEffect(() => {
		activeStripePaymentRef.current = activeStripePayment;
	}, [activeStripePayment]);

	async function beginPayment() {
		setPaymentErrorMessage(null);

		if (selectedProvider === "STRIPE") {
			setIsStripeCheckoutOpen(true);
			return;
		}

		setIsStartingPayment(true);

		try {
			const result = await startPayment({
				provider: selectedProvider,
				quoteId,
			});

			if (
				result.provider !== selectedProvider ||
				result.flow !== "REDIRECT"
			) {
				throw new Error("Unexpected payment provider response for redirect flow.");
			}

			window.location.assign(result.redirectUrl);
		} catch (error) {
			setPaymentErrorMessage(getErrorMessage(error));
		} finally {
			setIsStartingPayment(false);
		}
	}

	async function fetchStripeClientSecret() {
		setIsStartingPayment(true);
		setPaymentErrorMessage(null);

		try {
			const result = await startPayment({
				provider: "STRIPE",
				quoteId,
			});

			if (result.provider !== "STRIPE") {
				throw new Error("Unexpected payment provider response for Stripe.");
			}

			setActiveStripePayment(result);

			return result.clientSecret;
		} catch (error) {
			setIsStripeCheckoutOpen(false);
			setActiveStripePayment(null);
			setPaymentErrorMessage(getErrorMessage(error));
			throw error;
		} finally {
			setIsStartingPayment(false);
		}
	}

	function resetPaymentFlow() {
		setIsStripeCheckoutOpen(false);
		setActiveStripePayment(null);
		setPaymentErrorMessage(null);
	}

	function handleStripeComplete() {
		const completedPayment = activeStripePaymentRef.current;

		if (!completedPayment) {
			return;
		}

		setActiveStripePayment(null);
		setIsStripeCheckoutOpen(false);
		void navigate({
			to: "/checkout",
			replace: true,
			search: {
				paymentAttemptId: completedPayment.paymentAttemptId,
				quoteId,
			},
		});
	}

	return {
		activeStripePayment,
		beginPayment,
		fetchStripeClientSecret,
		handleStripeComplete,
		isStartingPayment,
		isStripeCheckoutOpen,
		paymentErrorMessage,
		resetPaymentFlow,
		selectedProvider,
		setSelectedProvider,
	};
}