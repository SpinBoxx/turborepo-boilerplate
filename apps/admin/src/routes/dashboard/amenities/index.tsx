import { createFileRoute } from "@tanstack/react-router";
import H1 from "@/components/H1";

export const Route = createFileRoute("/dashboard/amenities/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<H1>Services</H1>
			<p className="text-muted-foreground">Standards de service globaux.</p>
		</div>
	);
}
