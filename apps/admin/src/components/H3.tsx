import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";

type H3Props = ComponentProps<"h3">;

export default function H3({ className, ...props }: H3Props) {
	return (
		<h3
			className={cn(
				"font-semibold text-foreground text-xl leading-tight tracking-tight sm:text-2xl",
				className,
			)}
			{...props}
		/>
	);
}
