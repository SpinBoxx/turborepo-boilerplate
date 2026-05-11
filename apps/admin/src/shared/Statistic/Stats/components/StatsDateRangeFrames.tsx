import {
	cn,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zanadeal/ui";
import type { ComponentProps } from "react";
import type { DateFrame } from "../../utils/dates";
import { useStatContext } from "../StatsProvider";

const rangeMapping: { [key in DateFrame]: string } = {
	day: "Jours",
	hours: "Heures",
	minutes: "Minutes",
	month: "Mois",
	year: "Années",
};

export default function StatsDateRangeFramesSelect({
	className,
}: ComponentProps<"div">) {
	const { frames } = useStatContext();
	if (!frames) return null;
	return (
		<Select
			value={frames.currentFrame}
			onValueChange={(value) => frames.setCurrentFrame(value as DateFrame)}
		>
			<SelectTrigger className={cn("w-full max-w-48", className)}>
				<SelectValue placeholder="Select a frame" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{frames.frames.map((frame) => (
						<SelectItem key={frame} value={frame}>
							{rangeMapping[frame as DateFrame]}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
