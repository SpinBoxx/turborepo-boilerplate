import { cn } from "@zanadeal/ui";
import type { ComponentProps, JSX } from "react";
import { useChartContext } from "@/shared/Statistic/Chart/ChartProvider";
import { useStatContext } from "../../StatsProvider";
import type { AdditionalFieldInfo } from "../../StatsStrategies/strategy.types";

interface Props<T extends AdditionalFieldInfo<string>>
	extends Pick<ComponentProps<"div">, "className"> {
	additionalInfo?: (isFocus: boolean) => React.ReactNode;
	focusable?: boolean;
	icon?: JSX.Element;
	labelProps?: ComponentProps<"p">;
	metric: T;
	valueProps?: ComponentProps<"p">;
}

export default function StatsMetric<T extends AdditionalFieldInfo<string>>({
	additionalInfo,
	className,
	focusable = false,
	icon,
	labelProps,
	metric,
	valueProps,
	...props
}: Props<T>) {
	const {
		actions: { onFocusMetricChange },
		states: { focusedMetric },
	} = useChartContext();

	const { strategy } = useStatContext();

	const focused = focusedMetric === metric.key;

	return (
		<button
			className={cn(
				"metric min-w-fit space-y-2 px-4 py-4",
				focusable &&
					"group cursor-pointer rounded-lg border border-transparent hover:border-border",
				focused && "border-zinc-400",
				className,
			)}
			data-focusable={focusable}
			data-focused={focused}
			onClick={() => {
				if (focusable) {
					onFocusMetricChange(metric.key);
				}
			}}
			{...props}
		>
			<p
				className={cn(
					"flex items-center gap-2 text-muted-foreground",
					labelProps?.className,
				)}
				{...labelProps}
			>
				{icon && (
					<div
						className={cn(
							"flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-primary duration-200 [&_svg]:w-6 [&_svg]:stroke-white",
							focused
								? "bg-altprimary [&_svg]:stroke-zinc-800"
								: "bg-zinc-200 [&_svg]:stroke-zinc-600",
						)}
					>
						{icon}
					</div>
				)}
				{metric.label}:
			</p>
			<p
				{...valueProps}
				className={cn("bolder text-3xl", valueProps?.className)}
			>
				{strategy.formatMetricValue(metric.value, metric.valueType)}
			</p>
			{additionalInfo && (
				<div className="mt-2">
					{additionalInfo(focusedMetric === metric.key)}
				</div>
			)}
		</button>
	);
}
