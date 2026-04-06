import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/widgets/footer/footer";
import Navbar from "@/widgets/navbar/Navbar";

export const Route = createFileRoute("/_legal")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen text-foreground">
			<Navbar />
			<div className="mt-8">
				<Outlet />
			</div>
			<Footer className="mt-8" />
		</div>
	);
}
