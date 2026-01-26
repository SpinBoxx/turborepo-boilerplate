import { createFileRoute } from "@tanstack/react-router";
import RoomsPage from "@/features/rooms/RoomsPage/RoomsPage";

export const Route = createFileRoute("/dashboard/rooms/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<RoomsPage />
		</div>
	);
}
