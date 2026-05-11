import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isHotelReviewer } from "@zanadeal/utils";

export const Route = createFileRoute("/hotel-reviewer")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.auth.loadSession();
		if (!isHotelReviewer(user)) {
			throw redirect({
				to: "/login",
			});
		}
		return {
			user,
		};
	},
});

function RouteComponent() {
	return <Outlet />;
}
