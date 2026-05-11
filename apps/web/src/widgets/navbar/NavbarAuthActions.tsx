import { lazy, Suspense } from "react";
import { useAuth } from "@/auth/providers/AuthProvider";

const NavbarGuestActions = lazy(() => import("./NavbarGuestActions"));
const NavbarUserActions = lazy(() => import("./NavbarUserActions"));

export default function NavbarAuthActions() {
	const { user, signOut } = useAuth();

	if (!user) {
		return (
			<Suspense fallback={null}>
				<NavbarGuestActions />
			</Suspense>
		);
	}

	const userEmail = user.email ?? "";
	const userInitial = userEmail.trim().charAt(0).toUpperCase() || "?";

	return (
		<Suspense fallback={null}>
			<NavbarUserActions
				userEmail={userEmail}
				userInitial={userInitial}
				onSignOut={signOut}
			/>
		</Suspense>
	);
}
