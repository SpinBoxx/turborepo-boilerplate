import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import BookingRequestReviewPage from "@/features/payment/pages/BookingRequestReviewPage";

export const Route = createFileRoute(
	"/hotel-reviewer/bookings/requests/approve",
)({
	validateSearch: z.object({
		paymentAttemptId: z.string().min(1),
		quoteId: z.string().min(1).optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();

	return (
		<BookingRequestReviewPage
			decision="ACCEPT"
			paymentAttemptId={search.paymentAttemptId}
		/>
	);
}
