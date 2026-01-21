import { createFileRoute } from "@tanstack/react-router";
import HotelsPage from "@/features/hotel/HotelPage";

export const Route = createFileRoute("/dashboard/hotels/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <HotelsPage />;
}
