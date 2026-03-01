import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { User } from "../../../../packages/db/prisma/generated/client";

const RootLayout = () => (
	<div className="relative isolate mx-auto min-h-svh max-w-7xl p-5.5">
		<Outlet />
	</div>
);

interface MyRouterContext {
	auth: {
		loadSession: () => Promise<User | null | undefined>;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
