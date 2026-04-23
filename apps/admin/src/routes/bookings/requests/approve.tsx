import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAdmin } from "@zanadeal/utils";
import { z } from "zod";
import BookingRequestReviewPage from "@/features/payment/pages/BookingRequestReviewPage";

export const Route = createFileRoute("/bookings/requests/approve")({
	validateSearch: z.object({
		paymentAttemptId: z.string().min(1),
		quoteId: z.string().min(1).optional(),
	}),
	beforeLoad: async ({ context }) => {
		const user = await context.auth.loadSession();

		if (!isAdmin(user)) {
			throw redirect({
				to: "/login",
			});
		}
	},
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