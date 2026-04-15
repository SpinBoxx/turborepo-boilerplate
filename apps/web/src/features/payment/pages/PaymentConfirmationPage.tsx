import { useNavigate } from "@tanstack/react-router";
import type { BookingQuoteComputed } from "@zanadeal/api/features/booking-quote";
import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import type { RoomUserComputed } from "@zanadeal/api/features/room";
import { dateToString } from "@zanadeal/utils";
import { ArrowLeft, Hotel, Mail, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BookingCheckoutProvider from "@/features/booking/components/BookingCheckoutProvider";
import CheckoutQuotePriceDetailsCard from "@/features/booking/ui/CheckoutQuotePriceDetailsCard";
import NeedHelpCard from "@/features/booking/ui/NeedHelpCard";
import StaySummaryCard from "@/features/booking/ui/StaySummaryCard";
import PaymentConfirmationStep from "../components/PaymentConfirmationStep";
import { getPaymentConfirmationViewState } from "../services/payment-confirmation.service";
import PaymentConfirmationStatusCard from "../ui/PaymentConfirmationStatusCard";

interface PaymentConfirmationStatus {
	attemptStatus: "CANCELLED" | "EXPIRED" | "FAILED" | "PENDING" | "PROCESSING" | "SUCCEEDED";
	hotelBookingRequestNotificationStatus:
		| "FAILED"
		| "PENDING"
		| "PROCESSING"
		| "SENT"
		| null;
	paymentAttemptId: string;
	provider: "MANUAL" | "ORANGE_MONEY" | "STRIPE";
	providerPaymentStatus: string | null;
	providerSessionStatus: string | null;
	providerStatus: string | null;
}

interface PaymentConfirmationPageProps {
	hotel: HotelUserComputed;
	paymentStatus: PaymentConfirmationStatus;
	quote: BookingQuoteComputed;
	room: RoomUserComputed;
}

export default function PaymentConfirmationPage({
	hotel,
	paymentStatus,
	quote,
	room,
}: PaymentConfirmationPageProps) {
	const navigate = useNavigate();
	const checkInDate = dateToString(new Date(quote.checkInDate));
	const checkOutDate = dateToString(new Date(quote.checkOutDate));
	const viewState = getPaymentConfirmationViewState(paymentStatus);
	const isPendingHotelApproval = viewState === "pending-hotel-approval";
	const isRequestSubmissionDelayed =
		viewState === "request-submission-delayed";
	const isRequestSubmissionProcessing =
		viewState === "request-submission-processing";
	const canLeaveCheckout =
		isPendingHotelApproval ||
		isRequestSubmissionDelayed ||
		isRequestSubmissionProcessing;

	const steps = [
		{
			description: isPendingHotelApproval
				? "Your card authorization is locked in and linked to this reservation request."
				: isRequestSubmissionDelayed || isRequestSubmissionProcessing
					? "Your card authorization is secured. We are finishing the handoff of this request to the hotel."
				: "Return to checkout to finish securing your payment authorization.",
			icon: ShieldCheck,
			state:
				isPendingHotelApproval ||
				isRequestSubmissionDelayed ||
				isRequestSubmissionProcessing
					? "completed"
					: "current",
			title: "Secure payment authorization",
		},
		{
			description:
				isRequestSubmissionDelayed
					? "We are retrying the hotel notification so the property can begin its review."
					: isRequestSubmissionProcessing
						? "We are dispatching the request to the hotel team right now."
						: "The hotel team verifies availability and either accepts or declines the request.",
			icon: Hotel,
			state:
				isPendingHotelApproval ||
				isRequestSubmissionDelayed ||
				isRequestSubmissionProcessing
					? "current"
					: "upcoming",
			title: "Hotel review",
		},
		{
			description:
				"You receive the final decision by email, with the confirmed reservation details if accepted.",
			icon: Mail,
			state: "upcoming",
			title: "Final confirmation email",
		},
	] as const;

	return (
		<BookingCheckoutProvider
			room={room}
			hotel={hotel}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			guestCount={quote.guestCount}
		>
			<div className="py-8">
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.18em]">
							Payment confirmation
						</p>
						<h1 className="mt-2 font-bold text-2xl sm:text-3xl">
							{isPendingHotelApproval
								? "Your request is now waiting for hotel approval"
								: isRequestSubmissionDelayed || isRequestSubmissionProcessing
									? "We are finalizing the handoff to the hotel"
								: "Your booking request still needs attention"}
						</h1>
					</div>
					<div className="flex flex-wrap gap-3">
						{canLeaveCheckout ? (
							<Button onClick={() => void navigate({ to: "/" })}>
								Back to home
							</Button>
						) : (
							<Button
								onClick={() =>
									void navigate({
										to: "/checkout",
										replace: true,
										search: { quoteId: quote.id },
									})
								}
							>
								<ArrowLeft />
								Return to checkout
							</Button>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
					<div className="flex flex-col gap-6 lg:col-span-7">
						<PaymentConfirmationStatusCard
							hotelName={hotel.name}
							viewState={viewState}
						/>

						<Alert variant={isPendingHotelApproval ? "info" : "warning"}>
							<ShieldCheck />
							<AlertTitle>
								{isPendingHotelApproval
									? "What happens next"
									: isRequestSubmissionDelayed
										? "We are retrying the hotel handoff"
									: isRequestSubmissionProcessing
										? "Your payment is complete"
									: "Before the hotel can review your request"}
							</AlertTitle>
							<AlertDescription>
								<p>
									{isPendingHotelApproval
										? "Your checkout is complete. We now wait for the hotel to accept or decline the stay, and we will email you automatically as soon as a decision is made."
										: isRequestSubmissionDelayed
											? "Your checkout finished successfully, but the hotel notification needs another retry. No new payment is required from you, and we will continue the submission automatically."
										: isRequestSubmissionProcessing
											? "Your checkout finished successfully. We are currently dispatching the request to the hotel, and the review begins as soon as the property receives it."
										: "The reservation is not yet in the hotel approval queue. Complete the payment step first so the request can be submitted to the property."}
								</p>
							</AlertDescription>
						</Alert>

						<Card>
							<CardHeader>
								<CardTitle>Timeline</CardTitle>
							</CardHeader>
							<CardPanel className="space-y-4 pt-0">
								{steps.map((step, index) => (
									<div key={step.title}>
										<PaymentConfirmationStep {...step} />
										{index < steps.length - 1 ? (
											<Separator className="my-4" />
										) : null}
									</div>
								))}
							</CardPanel>
						</Card>
					</div>

					<div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-5">
						<StaySummaryCard />
						<CheckoutQuotePriceDetailsCard quote={quote} />
						<NeedHelpCard />
					</div>
				</div>
			</div>
		</BookingCheckoutProvider>
	);
}