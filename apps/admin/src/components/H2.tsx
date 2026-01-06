import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";

type H2Props = ComponentProps<"h2">;

export default function H2({ className, ...props }: H2Props) {
	return (
		<h2
			className={cn(
				"font-semibold text-2xl text-foreground leading-[1.2] tracking-tight sm:text-3xl",
				className,
			)}
			{...props}
		/>
	);
}
