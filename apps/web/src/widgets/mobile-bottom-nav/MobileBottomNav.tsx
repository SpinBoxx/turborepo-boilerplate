import { Link, useMatch, useRouterState } from "@tanstack/react-router";
import { Building2, House } from "lucide-react";
import { lazy, Suspense } from "react";
import { useIntlayer } from "react-intlayer";
import { useAuth } from "@/auth/providers/AuthProvider";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "@/features/hotels/ui/HotelToolbar/hotel-toolbar.options";
import {
	MobileBottomNavLink,
	mobileBottomNavItemClassName,
} from "./MobileBottomNavItem";

const MobileGuestActions = lazy(() => import("./MobileGuestActions"));
const MobileUserActions = lazy(() => import("./MobileUserActions"));

export default function MobileBottomNav() {
	const t = useIntlayer("navbar");
	const { user, signOut } = useAuth();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const hotelDetailMatch = useMatch({
		from: "/_app/$hotelId/",
		shouldThrow: false,
	});
	const hotelRoomsMatch = useMatch({
		from: "/_app/$hotelId/rooms/",
		shouldThrow: false,
	});

	if (hotelDetailMatch) {
		return null;
	}

	const hotelsActive = pathname.startsWith("/hotels") || !!hotelRoomsMatch;
	const userEmail = user?.email ?? "";
	const userInitial = userEmail.trim().charAt(0).toUpperCase() || "?";

	return (
		<nav
			aria-label={t.mobileNavigation.value}
			className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-lg md:hidden"
		>
			<div className="mx-auto flex max-w-md items-center justify-around gap-1">
				<Link to="/" className={mobileBottomNavItemClassName(pathname === "/")}>
					<MobileBottomNavLink icon={House} label={t.navbarLinks.home.value} />
				</Link>
				<Link
					to="/hotels"
					search={DEFAULT_HOTELS_PAGE_SEARCH}
					className={mobileBottomNavItemClassName(hotelsActive)}
				>
					<MobileBottomNavLink
						icon={Building2}
						label={t.navbarLinks.hotels.value}
					/>
				</Link>

				<Suspense fallback={null}>
					{user ? (
						<MobileUserActions
							userEmail={userEmail}
							userInitial={userInitial}
							onSignOut={signOut}
						/>
					) : (
						<MobileGuestActions loginActive={pathname.startsWith("/login")} />
					)}
				</Suspense>
			</div>
		</nav>
	);
}
