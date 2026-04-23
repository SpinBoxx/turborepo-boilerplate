import { useEffect, useState } from "react";
import BookingRequestReviewStatusCard from "../components/BookingRequestReviewStatusCard";
import { reviewBookingRequest } from "../payment.api";

interface BookingRequestReviewPageProps {
	decision: "ACCEPT" | "REJECT";
	paymentAttemptId: string;
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Unexpected error while processing this booking request.";
}

export default function BookingRequestReviewPage({
	decision,
	paymentAttemptId,
}: BookingRequestReviewPageProps) {
	const [status, setStatus] = useState<"error" | "loading" | "success">(
		"loading",
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		async function runReview() {
			try {
				setStatus("loading");
				setErrorMessage(null);
				await reviewBookingRequest({
					decision,
					paymentAttemptId,
					...(decision === "ACCEPT"
						? { validationNote: "Reviewed from admin email link" }
						: { rejectionReason: "Rejected from admin email link" }),
				});

				if (!isActive) {
					return;
				}

				setStatus("success");
			} catch (error) {
				if (!isActive) {
					return;
				}

				setStatus("error");
				setErrorMessage(getErrorMessage(error));
			}
		}

		void runReview();

		return () => {
			isActive = false;
		};
	}, [decision, paymentAttemptId]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
			<BookingRequestReviewStatusCard
				decision={decision}
				errorMessage={errorMessage}
				status={status}
			/>
		</div>
	);
}