import { cn } from "@zanadeal/ui";
import { stringToDate } from "@zanadeal/utils";
import { date } from "intlayer";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useBookingStore } from "../hooks/useBookingHook";

interface Props {
	className?: string;
	children?: React.ReactNode;
	buttonsProps?: ButtonProps;
}

export function BookingSearchBarCalendarPopover({
	className,
	buttonsProps,
}: Props) {
	const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } =
		useBookingStore();
	const { locale } = useIntlayerContext();

	const t = useIntlayer("booking-search-bar-calendar-popover");

	const formatDate = useMemo(() => {
		if (!checkInDate) return t.whenAreYouGoing.value;
		if (checkInDate && !checkOutDate)
			return date(checkInDate, { dateStyle: "medium", locale });
		if (checkInDate && checkOutDate)
			return `${date(checkInDate, { dateStyle: "medium", locale })} - ${date(checkOutDate, { dateStyle: "medium", locale })}`;

		return "";
	}, [checkInDate, checkOutDate, locale]);

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant={"outline"}
						className="w-full justify-start"
						{...buttonsProps}
					/>
				}
			>
				<CalendarDays />
				{formatDate}
			</PopoverTrigger>
			<PopoverContent>
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
			</PopoverContent>
		</Popover>
	);
}
