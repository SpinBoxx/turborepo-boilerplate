import { createFileRoute, redirect } from "@tanstack/react-router";
import SettingsLayoutPage from "@/features/settings/pages/SettingsLayoutPage";

export const Route = createFileRoute("/_app/settings")({
	beforeLoad: async ({ context, location }) => {
		const user = await context.auth.loadSession();
		if (!user) {
			throw redirect({
				to: "/login",
				search: {
					redirectTo: location.href,
				},
			});
		}
	},
	component: SettingsLayoutPage,
});
