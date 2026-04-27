import {
	createFileRoute,
	Outlet,
	useMatch,
	useRouterState,
} from "@tanstack/react-router";
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
	const isSettingsRoute = useRouterState({
		select: (state) => state.location.pathname.startsWith("/settings"),
	});

	useEffect(() => {
		refreshBooking();
	}, [refreshBooking]);

	return (
		<>
			<div
				className={cn(
					!hotelDetailMatch && !isSettingsRoute && "pb-18.25 md:pb-0",
				)}
			>
				{isSettingsRoute ? null : <Navbar />}
				<Outlet />
				{isSettingsRoute ? null : <Footer className="mt-14" />}
			</div>
			{isSettingsRoute ? null : <MobileBottomNav />}
		</>
	);
}
