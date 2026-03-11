import { cn } from "@zanadeal/ui";
import { stringToDate } from "@zanadeal/utils";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useBookingStore } from "../hooks/useBookingHook";

interface Props {
	className?: string;
}

export function BookingSearchBarCalendar({ className }: Props) {
	const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } =
		useBookingStore();

	return (
		<Calendar
			className={cn("flex w-full justify-center", className)}
			mode="range"
			disabled={{ before: new Date() }}
			selected={{
				from: stringToDate(checkInDate),
				to: stringToDate(checkOutDate),
			}}
			onSelect={(dateRange: DateRange) => {
				if (!dateRange.from || !dateRange.to) return;
				setCheckInDate(dateRange.from);
				setCheckOutDate(dateRange.to);
			}}
			required
		/>
	);
}
