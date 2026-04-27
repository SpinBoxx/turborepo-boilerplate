import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface MobileBottomNavLinkProps {
	icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
	label: string;
}

function mobileBottomNavItemClassName(active?: boolean) {
	return cn(
		"flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md px-2 py-1.5 text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
		active && "text-primary",
	);
}

function MobileBottomNavLink({ icon: Icon, label }: MobileBottomNavLinkProps) {
	return (
		<>
			<Icon aria-hidden className="size-6" />
			<span className="max-w-full truncate font-medium text-xs">{label}</span>
		</>
	);
}

export { mobileBottomNavItemClassName, MobileBottomNavLink };
