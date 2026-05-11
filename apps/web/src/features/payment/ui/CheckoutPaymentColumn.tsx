import { CircleAlert, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCheckoutPayment } from "../hooks/useCheckoutPayment";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import StripeEmbeddedCheckoutCard from "../components/StripeEmbeddedCheckoutCard";
import { getCheckoutPaymentMethodOptions } from "../services/payment-ui.service";

interface CheckoutPaymentColumnProps {
	quoteId: string;
}

export default function CheckoutPaymentColumn({
	quoteId,
}: CheckoutPaymentColumnProps) {
	const {
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
	} = useCheckoutPayment({ quoteId });

	const paymentMethods = getCheckoutPaymentMethodOptions();

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-balance">Choose how you want to pay</CardTitle>
				</CardHeader>
				<CardPanel className="space-y-5 pt-0">
					<div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background">
							<ShieldCheck className="size-4 text-primary" />
						</div>
						<div>
							<p className="font-medium text-sm">Authorization before confirmation</p>
							<p className="mt-1 text-pretty text-muted-foreground text-sm">
								We start with a secure payment authorization. Your final charge only happens after hotel approval.
							</p>
						</div>
					</div>

					<PaymentMethodSelector
						onProviderChange={setSelectedProvider}
						options={paymentMethods}
						selectedProvider={selectedProvider}
					/>

					{paymentErrorMessage ? (
						<Alert variant="error">
							<CircleAlert />
							<AlertTitle>Unable to continue the payment</AlertTitle>
							<AlertDescription>{paymentErrorMessage}</AlertDescription>
						</Alert>
					) : null}

					{!isStripeCheckoutOpen ? (
						<Button
							className="w-full"
								disabled={isStartingPayment}
							onClick={() => void beginPayment()}
							size="lg"
						>
							{isStartingPayment ? <Spinner aria-hidden="true" /> : <CreditCard />}
							Continue with {selectedProvider === "STRIPE" ? "card" : "Orange Money"}
						</Button>
					) : null}
				</CardPanel>
			</Card>

			{isStripeCheckoutOpen ? (
				<StripeEmbeddedCheckoutCard
					fetchClientSecret={fetchStripeClientSecret}
					onComplete={handleStripeComplete}
					onRestart={resetPaymentFlow}
					paymentAttemptId={activeStripePayment?.paymentAttemptId ?? quoteId}
				/>
			) : null}
		</div>
	);
}