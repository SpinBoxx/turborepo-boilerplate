import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import type { User } from "../../../../packages/db/prisma/generated/client";

export const containerClassName = "mx-auto px-5.5 sm:px-8 max-w-7xl";

const RootLayout = () => (
	<>
		<HeadContent />
		<div className="relative isolate mx-auto min-h-dvh max-w-7xl px-5.5 pb-3.5 sm:px-8">
			<Outlet />
		</div>
	</>
);

interface MyRouterContext {
	auth: {
		loadSession: () => Promise<User | null | undefined>;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
});
