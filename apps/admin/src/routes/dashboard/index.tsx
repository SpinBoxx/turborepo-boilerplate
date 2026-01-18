import { createFileRoute } from "@tanstack/react-router";
import HotelPage from "@/features/hotel/HotelPage";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <HotelPage />;
}
