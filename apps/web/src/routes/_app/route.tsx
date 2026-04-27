import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { cn } from "@/lib/utils";
import Footer from "@/widgets/footer/footer";
import MobileBottomNav from "@/widgets/mobile-bottom-nav/MobileBottomNav";
import Navbar from "@/widgets/navbar/Navbar";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	const refreshBooking = useBookingStore((state) => state.refreshBooking);
	const hotelDetailMatch = useMatch({
		from: "/_app/$hotelId/",
		shouldThrow: false,
	});

	useEffect(() => {
		refreshBooking();
	}, [refreshBooking]);

	return (
		<>
			<div className={cn(!hotelDetailMatch && "pb-[73px] md:pb-0")}>
				<Navbar />
				<Outlet />
				<Footer className="mt-14" />
			</div>
			<MobileBottomNav />
		</>
	);
}
