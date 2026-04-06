import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { sanitizeRedirectTo } from "@/auth/services/auth-dialog.service";

export const Route = createFileRoute("/_auth/login")({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
	}),
	component: Outlet,
	beforeLoad: async ({ context, search }) => {
		const user = await context.auth.loadSession();
		const safeRedirectTo = sanitizeRedirectTo(search.redirectTo);
		if (user) {
			throw redirect({
				to: safeRedirectTo ?? "/",
			});
		}
	},
});