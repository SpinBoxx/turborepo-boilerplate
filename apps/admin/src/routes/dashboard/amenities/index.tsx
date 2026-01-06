import { createFileRoute } from "@tanstack/react-router";
import AmenityPage from "@/features/amenity/AmenityPage";

export const Route = createFileRoute("/dashboard/amenities/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AmenityPage />;
}
