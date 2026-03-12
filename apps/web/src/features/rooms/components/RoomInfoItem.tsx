import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"div"> {
	contentClassName?: string;
	icon: LucideIcon;
	iconClassName?: string;
	label: ReactNode;
	labelClassName?: string;
	value: ReactNode;
	valueClassName?: string;
}

export default function RoomInfoItem({
	className,
	contentClassName,
	icon: Icon,
	iconClassName,
	label,
	labelClassName,
	value,
	valueClassName,
	...props
}: Props) {
	return (
		<div
			className={cn(
				"flex min-w-0 items-center gap-3 text-[1.05rem] text-foreground",
				className,
			)}
			{...props}
		>
			<Icon
				className={cn(
					"size-6 shrink-0 stroke-[2.1] text-foreground",
					iconClassName,
				)}
			/>
			<div
				className={cn("flex min-w-0 items-baseline gap-1.5", contentClassName)}
			>
				<span
					className={cn("font-semibold tracking-[-0.03em]", valueClassName)}
				>
					{value}
				</span>
				<span className={cn("font-medium text-foreground/80", labelClassName)}>
					{label}
				</span>
			</div>
		</div>
	);
}
