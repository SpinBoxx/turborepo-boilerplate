import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
	component: Outlet,
	beforeLoad: async ({ context }) => {
		const user = await context.auth.loadSession();
		if (user) {
			throw redirect({
				to: "/",
			});
		}
	},
});