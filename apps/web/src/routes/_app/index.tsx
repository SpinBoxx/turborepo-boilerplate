import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/auth/providers/AuthProvider";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const user = await context.auth.loadSession();
		console.log(user);

		const data = await orpc.amenity.list({});
		console.log(data);
	},
});

function RouteComponent() {
	const { user } = useAuth();
	return (
		<div>
			<p>Welcome, {user ? user.email : "Guest"}!</p>
		</div>
	);
}
