import {
	createRootRouteWithContext,
	Link,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { AuthUser } from "@/auth/providers/AuthProvider";
import { ModeToggle } from "@/components/ThemeToggle";

const RootLayout = () => (
	<>
		<div className="flex gap-2 p-2">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link>{" "}
			<Link to="/mon-hotel" className="[&.active]:font-bold">
				Mon hôtel
			</Link>{" "}
			<ModeToggle />
		</div>
		<hr />
		<Outlet />
		<TanStackRouterDevtools />
	</>
);

interface MyRouterContext {
	user: AuthUser | null;
	auth: {
		getUser: () => AuthUser | null;
		loadSession: () => Promise<AuthUser | null>;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
