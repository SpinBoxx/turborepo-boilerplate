import { createFileRoute } from "@tanstack/react-router";
import { SidebarTrigger } from "@zanadeal/ui";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<SidebarTrigger />
			Hello "/dashboard/"!
		</div>
	);
}
