import { cn } from "@zanadeal/ui";
import type { PropsWithChildren } from "react";

export default function Container({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) {
	return (
		<div
			className={cn(
				"mx-auto flex min-h-dvh w-full max-w-7xl flex-1 flex-col px-4 sm:px-8 xl:px-0",
				className,
			)}
		>
			{children}
		</div>
	);
}
