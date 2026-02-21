import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";

type H1Props = ComponentProps<"h1">;

export default function H1({ className, ...props }: H1Props) {
	return (
		<h1
			className={cn(
				"font-bold text-3xl text-foreground leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl",
				className,
			)}
			{...props}
		/>
	);
}
