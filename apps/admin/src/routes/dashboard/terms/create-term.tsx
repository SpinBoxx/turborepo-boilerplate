import { createFileRoute } from "@tanstack/react-router";
import CreateTermPage from "@/features/terms/CreateTermPage/CreateTermPage";

export const Route = createFileRoute("/dashboard/terms/create-term")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<CreateTermPage />
		</div>
	);
}
