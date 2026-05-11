import { Calendar, cn } from "@zanadeal/ui";
import { format } from "date-fns";
import { useStatContext } from "../StatsProvider";

interface Props {
	className?: string;
	type: "date" | "other";
}

export default function StatsRangeDisplay({ className, type }: Props) {
	const { frames, rangeContext, strategy } = useStatContext();
	const { onRangeChange, range } = rangeContext;

	// Formatted range for display
	const startDisplay = strategy.formatKeyForDisplay(
		range.startKey,
		frames?.currentFrame,
	);
	const endDisplay = strategy.formatKeyForDisplay(
		range.endKey,
		frames?.currentFrame,
	);

	const fromDate = new Date(range.startKey);
	const toDate = new Date(range.endKey);

	return type === "date" && frames ? (
		<Calendar
			mode="range"
			selected={{
				from: fromDate,
				to: toDate,
			}}
			onSelect={(value) => {
				if (value?.from) {
					onRangeChange({
						endKey: value.to
							? format(value.to, "yyyy-MM-dd")
							: format(value.from, "yyyy-MM-dd"),
						startKey: format(value.from, "yyyy-MM-dd"),
					});
				}
			}}
		/>
	) : (
		<div className={cn("", className)}>
			<span className="text-sm text-zinc-600">
				{startDisplay} → {endDisplay}
			</span>
		</div>
	);
}

// const DisplayRangeDate = () => {
//   const { dataContext, rangeContext } = useStatContext();
//   const { onRangeChange, range } = rangeContext;
//   const { dataByFrame } = dataContext;
//
//   if (!dataByFrame || dataByFrame.length === 0) {
//     return null;
//   }
//
//   const fromDate = new Date(range.startKey);
//   const toDate = new Date(range.endKey);
//
//   return (
//     <InputContainer className={}>
//       <DateRangePicker
//         calendarProps={{
//           mode: 'range',
//         }}
//         value={{
//           from: fromDate,
//           to: toDate,
//         }}
//         onChange={(value) => {
//           if (value?.from) {
//             onRangeChange({
//               endKey: value.to ? format(value.to, 'yyyy-MM-dd') : format(value.from, 'yyyy-MM-dd'),
//               startKey: format(value.from, 'yyyy-MM-dd'),
//             });
//           }
//         }}
//       />
//     </InputContainer>
//   );
// };
