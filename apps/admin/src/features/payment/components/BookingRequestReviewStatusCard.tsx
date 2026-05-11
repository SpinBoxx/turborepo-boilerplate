import { Link } from "@tanstack/react-router";
import { Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "@zanadeal/ui";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";

interface BookingRequestReviewStatusCardProps {
	decision: "ACCEPT" | "REJECT";
	errorMessage: string | null;
	status: "error" | "loading" | "success";
}

function getContent(
	decision: "ACCEPT" | "REJECT",
	status: "error" | "loading" | "success",
	errorMessage: string | null,
) {
	if (status === "loading") {
		return {
			description:
				decision === "ACCEPT"
					? "We are confirming the stay and capturing the existing card authorization."
					: "We are refusing the stay and cancelling the existing card authorization.",
			icon: Spinner,
			title:
				decision === "ACCEPT"
					? "Accepting booking request"
					: "Rejecting booking request",
		};
	}

	if (status === "success") {
		return {
			description:
				decision === "ACCEPT"
					? "The booking has been confirmed and the Stripe payment capture was requested successfully."
					: "The booking has been rejected and the Stripe authorization cancellation was requested successfully.",
			icon: decision === "ACCEPT" ? CheckCircle2 : XCircle,
			title:
				decision === "ACCEPT"
					? "Booking request accepted"
					: "Booking request rejected",
		};
	}

	return {
		description:
			errorMessage ??
			"We could not complete this booking review request. Please retry from the admin dashboard.",
		icon: CircleAlert,
		title: "Action could not be completed",
	};
}

export default function BookingRequestReviewStatusCard({
	decision,
	errorMessage,
	status,
}: BookingRequestReviewStatusCardProps) {
	const content = getContent(decision, status, errorMessage);
	const Icon = content.icon;

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
					<Icon className={status === "loading" ? "animate-spin" : undefined} />
				</div>
				<CardTitle>{content.title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<p className="text-muted-foreground text-sm leading-6">
					{content.description}
				</p>
				<div className="flex flex-wrap gap-3">
					<Link to="/dashboard">
						<Button>Back to dashboard</Button>
					</Link>
					{status === "error" ? (
						<Link to="/dashboard/hotels">
							<Button variant="outline">Open hotels</Button>
						</Link>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}