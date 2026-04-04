import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import Footer from "@/components/footer/footer";
import Container from "@/components/widgets/container";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import Navbar from "@/widgets/navbar/Navbar";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	const refreshBooking = useBookingStore((state) => state.refreshBooking);

	useEffect(() => {
		refreshBooking();
	}, [refreshBooking]);

	return (
		<Container>
			<Navbar />
			<Outlet />
			<Footer className="mt-14" />
		</Container>
	);
}
