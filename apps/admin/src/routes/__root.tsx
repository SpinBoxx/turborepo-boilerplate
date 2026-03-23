import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { UserComputed } from "@zanadeal/api/features/user";

const RootLayout = () => (
	<>
		<Outlet />
		{/* <TanStackRouterDevtools /> */}
	</>
);

interface MyRouterContext {
	user: UserComputed | null;
	auth: {
		loadSession: () => Promise<UserComputed | null | undefined>;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
