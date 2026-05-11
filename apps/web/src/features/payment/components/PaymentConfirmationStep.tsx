import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentConfirmationStepProps {
	description: string;
	icon: LucideIcon;
	state: "completed" | "current" | "upcoming";
	title: string;
}

const stateStyles = {
	completed: {
		badge: "success" as const,
		icon: "bg-success/10 text-success",
		label: "Done",
	},
	current: {
		badge: "warning" as const,
		icon: "bg-warning/10 text-warning",
		label: "Current",
	},
	upcoming: {
		badge: "outline" as const,
		icon: "bg-muted text-muted-foreground",
		label: "Next",
	},
};

export default function PaymentConfirmationStep({
	description,
	icon: Icon,
	state,
	title,
}: PaymentConfirmationStepProps) {
	const styles = stateStyles[state];

	return (
		<div className="flex items-start gap-4 rounded-2xl border bg-background/70 p-4">
			<div
				className={cn(
					"flex size-11 shrink-0 items-center justify-center rounded-2xl",
					styles.icon,
				)}
			>
				<Icon className="size-5" />
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2">
					<p className="font-medium text-sm sm:text-base">{title}</p>
					<Badge size="sm" variant={styles.badge}>
						{styles.label}
					</Badge>
				</div>
				<p className="mt-1 text-pretty text-muted-foreground text-sm">
					{description}
				</p>
			</div>
		</div>
	);
}