import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import Container from "@/components/widgets/container";
import type { User } from "../../../../packages/db/prisma/generated/client";

export const containerClassName = "mx-auto px-5.5 sm:px-8 max-w-7xl";

const RootLayout = () => (
	<>
		<HeadContent />
		<div className="relative isolate min-h-dvh">
			<Container>
				<Outlet />
			</Container>
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
