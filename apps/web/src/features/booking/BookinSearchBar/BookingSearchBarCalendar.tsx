import { stringToDate } from "@zanadeal/utils";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useBookingStore } from "../hooks/useBookingHook";

const BookingSearchBarCalendar = () => {
	const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } =
		useBookingStore();

	const isMobile = useIsMobile(650);

	return (
		<Calendar
			numberOfMonths={isMobile ? 1 : 2}
			pagedNavigation
			className={cn("flex w-full justify-center")}
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
};

export default BookingSearchBarCalendar;
