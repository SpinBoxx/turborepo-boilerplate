import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@zanadeal/ui";
import { isAdmin } from "@zanadeal/utils";
import { DashboardSidebar } from "@/components/sidebar/DashboardSidebar";
import SidebarNavbar from "@/components/sidebar/SidebarNavbar";

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
	return (
		<SidebarProvider>
			<div className="relative flex h-screen w-full">
				<DashboardSidebar />
				<SidebarInset className="min-h-fit space-y-4 p-2 md:p-6">
					<SidebarNavbar />
					<div className="p-2">
						<Outlet />
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
