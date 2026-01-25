import { createFileRoute, useParams } from "@tanstack/react-router";
import UpdateTermPage from "@/features/terms/UpdateTermPage/UpdateTermPage";

export const Route = createFileRoute("/dashboard/terms/$id/update-term")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = useParams({ from: "/dashboard/terms/$id/update-term" });
	return (
		<div>
			<UpdateTermPage termId={id} />
		</div>
	);
}
