import { useRouter } from "@tanstack/react-router";
import { Button, cn, useSidebar } from "@zanadeal/ui";
import { LogOut } from "lucide-react";
import { useAuth } from "../../auth/providers/AuthProvider";

export default function SidebarSignOutButton() {
	const { signOut } = useAuth();
	const router = useRouter();
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";
	return (
		<Button
			onClick={async () => {
				await signOut({
					onSuccess: () => {
						router.invalidate();
						router.navigate({
							to: "/login",
						});
					},
				});
			}}
			size={isCollapsed ? "icon" : "default"}
			className={cn(
				"group/signout flex items-center justify-center rounded-md bg-destructive/10 font-bold text-destructive text-xs uppercase tracking-wider transition-all hover:bg-destructive hover:text-destructive-foreground",
				!isCollapsed ? "px-4 py-3.5" : "",
			)}
		>
			<LogOut
				className={cn(
					"h-4 w-4 transition-transform",
					!isCollapsed && "group-hover/signout:-translate-x-1",
				)}
			/>
			{isCollapsed ? null : "Déconnexion"}
		</Button>
	);
}
