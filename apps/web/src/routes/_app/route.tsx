import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/Navbar";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-7xl">
			<Navbar />
			<Outlet />
			<Footer className="mt-14" />
		</div>
	);
}
