import { createFileRoute, Outlet } from "@tanstack/react-router";
import AuthLayout from "@/auth/components/AuthLayout";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}
