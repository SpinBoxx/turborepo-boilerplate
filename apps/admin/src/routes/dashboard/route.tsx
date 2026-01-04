import {
	createFileRoute,
	Outlet,
	redirect,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import { Button } from "@zanadeal/ui";
import { isAdmin } from "@zanadeal/utils";
import { useAuth } from "@/auth/providers/AuthProvider";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const user =
			context.user ??
			context.auth.getUser() ??
			(await context.auth.loadSession());
		if (!isAdmin(user)) {
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
	const { user, signOut } = useAuth();
	const { user: routeUser } = useRouteContext({ from: "/dashboard" });
	const router = useRouter();
	return (
		<div>
			{user?.email}r{routeUser?.email}
			<Button
				onClick={async () => {
					await signOut({ onSuccess: () => router.invalidate() });
					router.navigate({ to: "/login" });
				}}
			>
				signout
			</Button>
			<Outlet />
		</div>
	);
}
