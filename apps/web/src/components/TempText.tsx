import { cn } from "@zanadeal/ui";
import { type ReactNode, useEffect, useState } from "react";

interface Props {
	children: ReactNode;
	className?: string;
	trigger: number;
	duration?: number;
}

export default function TmpText({
	children,
	className,
	trigger,
	duration = 3000,
}: Props) {
	const [isVisible, setIsVisible] = useState(false);
	const hasContent =
		children !== null && children !== undefined && children !== false;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!hasContent) {
			setIsVisible(false);
			return;
		}

		setIsVisible(true);

		const timeout = window.setTimeout(() => {
			setIsVisible(false);
		}, duration);

		return () => window.clearTimeout(timeout);
	}, [trigger, duration, hasContent]);

	if (!hasContent || !isVisible) {
		return null;
	}

	return <span className={cn(className)}>{children}</span>;
}
