import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AuthLayout from "@/auth/components/AuthLayout";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user = await context.auth.loadSession();

		if (user) {
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
