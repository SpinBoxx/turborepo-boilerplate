import { createFileRoute } from "@tanstack/react-router";
import BookingStatsDashboardPage from "@/features/booking-stats/pages/BookingStatsDashboardPage";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <BookingStatsDashboardPage />;
}
