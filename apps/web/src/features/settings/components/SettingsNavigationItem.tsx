import { Link, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsNavigationItemProps {
	icon: LucideIcon;
	label: string;
	to: LinkProps["to"];
	active?: boolean;
}

export default function SettingsNavigationItem({
	active = false,
	icon: Icon,
	label,
	to,
}: SettingsNavigationItemProps) {
	return (
		<Link
			className={cn(
				"flex min-h-13 w-full items-center gap-4 rounded-xl px-4 text-left text-base text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-12 md:gap-3",
				active && "bg-secondary font-semibold",
			)}
			to={to}
		>
			<Icon aria-hidden="true" className="size-5 shrink-0 stroke-[1.8]" />
			<span className="min-w-0 flex-1">{label}</span>
			<ChevronRightIcon
				aria-hidden="true"
				className="size-5 shrink-0 text-muted-foreground md:hidden"
			/>
		</Link>
	);
}