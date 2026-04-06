import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import Footer from "@/widgets/footer/footer";
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
		<>
			<Navbar />
			<Outlet />
			<Footer className="mt-14" />
		</>
	);
}
