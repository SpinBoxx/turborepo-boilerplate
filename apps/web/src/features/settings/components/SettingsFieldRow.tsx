import type { ReactNode } from "react";

interface SettingsFieldRowProps {
	actionLabel?: string;
	children?: ReactNode;
	description?: ReactNode;
	onAction?: () => void;
	title: string;
}

export default function SettingsFieldRow({
	actionLabel,
	children,
	description,
	onAction,
	title,
}: SettingsFieldRowProps) {
	return (
		<div className="border-b py-5">
			<div className="flex items-start justify-between gap-5">
				<div className="min-w-0 flex-1">
					<h3 className="font-semibold text-base text-foreground leading-5">
						{title}
					</h3>
					{description ? (
						<div className="mt-1 text-muted-foreground text-sm leading-5">
							{description}
						</div>
					) : null}
				</div>
				{actionLabel && onAction ? (
					<button
						className="font-semibold text-sm underline underline-offset-2 hover:text-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						onClick={onAction}
						type="button"
					>
						{actionLabel}
					</button>
				) : null}
			</div>
			{children ? <div className="mt-5">{children}</div> : null}
		</div>
	);
}