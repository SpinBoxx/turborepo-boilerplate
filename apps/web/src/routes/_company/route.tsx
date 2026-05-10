import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/widgets/footer/footer";
import Navbar from "@/widgets/navbar/Navbar";

export const Route = createFileRoute("/_company")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-dvh flex-col text-foreground">
			<Navbar />
			<main className="flex flex-1 flex-col">
				<Outlet />
			</main>
			<Footer className="mt-8" />
		</div>
	);
}
