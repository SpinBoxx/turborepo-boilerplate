import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAdmin } from "@zanadeal/utils";
import AuthLayout from "@/auth/components/AuthLayout";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.auth.loadSession();

		if (isAdmin(user)) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
});

function RouteComponent() {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}
