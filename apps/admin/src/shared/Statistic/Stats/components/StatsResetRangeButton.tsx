import { Button, type ButtonVariants, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useStatContext } from "../StatsProvider";

interface Props extends Omit<ComponentProps<"button">, "action"> {
	variant?: ButtonVariants["variant"];
}

export default function StatsResetRangeButton({
	children,
	className,
	variant = "outline",
}: Props) {
	const { rangeContext } = useStatContext();
	return (
		<Button
			onClick={async () => rangeContext.resetRange()}
			className={cn("", className)}
			variant={variant}
		>
			{children}
		</Button>
	);
}
