import { CircleAlert, CircleCheckBig, LoaderCircle } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { StripePaymentViewState } from "../services/payment-ui.service";

interface PaymentStatusAlertProps {
	onRetry?: () => void;
	viewState: Exclude<StripePaymentViewState, "idle">;
}

const statusCopy = {
	authorized: {
		description:
			"Your card authorization has been recorded. The booking now waits for hotel confirmation before final capture.",
		icon: CircleCheckBig,
		title: "Card authorization received",
		variant: "success",
	},
	failed: {
		description:
			"We could not initialize a secure payment session. You can start again safely.",
		icon: CircleAlert,
		title: "Payment session failed",
		variant: "error",
	},
	processing: {
		description:
			"We are checking Stripe's latest status before showing the next available action.",
		icon: LoaderCircle,
		title: "Checking payment status",
		variant: "info",
	},
	retry_required: {
		description:
			"Your previous Stripe session is no longer usable. Start a fresh one to continue securely.",
		icon: CircleAlert,
		title: "Payment not completed",
		variant: "warning",
	},
} as const;

export default function PaymentStatusAlert({
	onRetry,
	viewState,
}: PaymentStatusAlertProps) {
	const copy = statusCopy[viewState];
	const Icon = copy.icon;

	return (
		<Alert variant={copy.variant}>
			<Icon className={viewState === "processing" ? "animate-spin" : undefined} />
			<AlertTitle>{copy.title}</AlertTitle>
			<AlertDescription>{copy.description}</AlertDescription>
			{onRetry && (viewState === "failed" || viewState === "retry_required") ? (
				<AlertAction>
					<Button onClick={onRetry} size="sm" variant="outline">
						Start again
					</Button>
				</AlertAction>
			) : null}
		</Alert>
	);
}