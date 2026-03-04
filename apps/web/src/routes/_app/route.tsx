import { createFileRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/navbar/Navbar";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-7xl space-y-5">
			<Navbar />
			<Outlet />
		</div>
	);
}
