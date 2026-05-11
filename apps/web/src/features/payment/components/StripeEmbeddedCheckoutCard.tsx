import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardFooter,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import {
	getStripeEmbeddedCheckoutSecurityIssue,
	hasStripePublishableKey,
	stripePromise,
} from "../services/stripe-client";

interface StripeEmbeddedCheckoutCardProps {
	fetchClientSecret: () => Promise<string>;
	onComplete: () => void;
	onRestart: () => void;
	paymentAttemptId: string;
}

export default function StripeEmbeddedCheckoutCard({
	fetchClientSecret,
	onComplete,
	onRestart,
	paymentAttemptId,
}: StripeEmbeddedCheckoutCardProps) {
	const onCompleteRef = useRef(onComplete);
	const fetchClientSecretRef = useRef(fetchClientSecret);

	useEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	useEffect(() => {
		fetchClientSecretRef.current = fetchClientSecret;
	}, [fetchClientSecret]);

	const embeddedCheckoutOptions = useMemo(
		() => ({
			fetchClientSecret: () => fetchClientSecretRef.current(),
			onComplete: () => onCompleteRef.current(),
		}),
		[],
	);
	const securityIssue = getStripeEmbeddedCheckoutSecurityIssue();

	if (!hasStripePublishableKey()) {
		return (
			<Alert variant="error">
				<LockKeyhole />
				<AlertTitle>Stripe is not configured on the web app</AlertTitle>
				<AlertDescription>
					The publishable key is missing, so the embedded checkout cannot be
					rendered.
				</AlertDescription>
			</Alert>
		);
	}

	if (securityIssue) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-balance">Secure card payment</CardTitle>
				</CardHeader>
				<CardPanel className="space-y-4 pt-0">
					<Alert variant="warning">
						<LockKeyhole />
						<AlertTitle>Open this page from a secure origin</AlertTitle>
						<AlertDescription className="space-y-2">
							<p className="text-pretty">{securityIssue.message}</p>
							<p className="text-pretty break-all font-mono text-muted-foreground text-xs tabular-nums">
								{securityIssue.currentUrl}
							</p>
							<p className="text-pretty">
								For local development, use the exact browser origin{" "}
								<strong>http://localhost:3001</strong> if the web app is running
								there, not an IP like{" "}
								<strong>http://{securityIssue.hostname}:3001</strong>.
							</p>
						</AlertDescription>
					</Alert>
				</CardPanel>
				<CardFooter className="justify-end pt-0">
					<Button onClick={onRestart} variant="outline">
						Back to payment methods
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-balance">Secure card payment</CardTitle>
			</CardHeader>
			<CardPanel className="space-y-4 pt-0">
				<Alert variant="info">
					<ShieldCheck />
					<AlertTitle>Your card is authorized first</AlertTitle>
					<AlertDescription>
						We only collect a secure authorization now. Final capture happens
						later, once the hotel confirms the reservation.
					</AlertDescription>
				</Alert>
				<div className="rounded-xl border bg-background p-2">
					<EmbeddedCheckoutProvider
						options={embeddedCheckoutOptions}
						stripe={stripePromise}
					>
						<EmbeddedCheckout
							className="min-h-96 w-full"
							id={`stripe-embedded-checkout-${paymentAttemptId}`}
						/>
					</EmbeddedCheckoutProvider>
				</div>
			</CardPanel>
			<CardFooter className="justify-end pt-0">
				<Button onClick={onRestart} variant="outline">
					Start over
				</Button>
			</CardFooter>
		</Card>
	);
}
