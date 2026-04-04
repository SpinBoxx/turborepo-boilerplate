import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/footer/footer";
import Navbar from "@/widgets/navbar/Navbar";

export const Route = createFileRoute("/_checkout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
}
