import { ToggleGroup, ToggleGroupItem } from "@zanadeal/ui";
import { ChartColumnBig, ChartLine, type LucideIcon } from "lucide-react";
import type { JSX } from "react";
import { useChartContext } from "./ChartProvider";

export default function ChartDisplayButtonGroup() {
	const {
		chartConfig: { chartTypes },
		displayedChart,
		setDisplayedChart,
	} = useChartContext();

	const options: { title: JSX.Element; value: keyof typeof chartTypes }[] =
		Object.keys(chartTypes).map((key) => {
			let IconComponent: LucideIcon;
			switch (key as keyof typeof chartTypes) {
				case "bar":
					IconComponent = ChartColumnBig;
					break;
				case "line":
					IconComponent = ChartLine;
					break;
				default:
					IconComponent = ChartColumnBig;
			}
			return {
				title: <IconComponent size={18} />,
				value: key as keyof typeof chartTypes,
			};
		});

	return (
		<ToggleGroup type="single" value={displayedChart}>
			{options.map(({ title, value }) => (
				<ToggleGroupItem
					value={value}
					key={value}
					onClick={() => setDisplayedChart(value)}
				>
					{title}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
