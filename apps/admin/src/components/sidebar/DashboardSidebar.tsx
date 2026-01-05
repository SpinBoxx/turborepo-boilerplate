"use client";

import { Link } from "@tanstack/react-router";
import {
	cn,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarTrigger,
	useSidebar,
} from "@zanadeal/ui";
import { motion } from "framer-motion";
import { Home, HotelIcon } from "lucide-react";
import SidebarSignOutButton from "@/components/sidebar/SidebarSignOutButton";
import Logo from "../Logo";
import DashboardNavigation, { type Route } from "./DashboardNavigation";
import { SidebarThemeToggle } from "./SidebarThemeToggle";

const dashboardRoutes: Route[] = [
	{
		id: "home",
		title: "Home",
		icon: <Home className="size-4" />,
		link: "/",
	},
	{
		id: "hotels",
		title: "Hotels",
		icon: <HotelIcon className="size-4" />,
		link: "/dashboard",
	},
];

export function DashboardSidebar() {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader
				className={cn(
					"flex md:pt-3.5",
					isCollapsed
						? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
						: "flex-row items-center justify-between",
				)}
			>
				<Link to="/dashboard" className="flex items-center gap-2 self-center">
					<Logo className="size-10 fill-primary" />
					{!isCollapsed && (
						<span className="font-semibold text-black dark:text-white">
							Zanadeal
						</span>
					)}
				</Link>

				<motion.div
					key={isCollapsed ? "header-collapsed" : "header-expanded"}
					className={cn(
						"flex items-center gap-2",
						isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row",
					)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
				>
					{/* <NotificationsPopover notifications={sampleNotifications} /> */}
					<SidebarTrigger />
				</motion.div>
			</SidebarHeader>
			<SidebarContent className="gap-4 px-2 py-4">
				<DashboardNavigation routes={dashboardRoutes} />
			</SidebarContent>
			<SidebarFooter className="px-2">
				<SidebarThemeToggle />
				<SidebarSignOutButton />
			</SidebarFooter>
		</Sidebar>
	);
}
