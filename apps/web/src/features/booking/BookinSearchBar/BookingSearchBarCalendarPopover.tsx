import { date } from "intlayer";
import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useBookingStore } from "../hooks/useBookingHook";
import BookingNoBookingAfterHoursInfo from "./BookingNoBookingAfterHoursInfo";
import BookingSearchBarCalendar from "./BookingSearchBarCalendar";

interface Props {
	className?: string;
	children?: React.ReactNode;
	buttonsProps?: ButtonProps;
}

export function BookingSearchBarCalendarPopover({ buttonsProps }: Props) {
	const { checkInDate, checkOutDate } = useBookingStore();
	const { locale } = useIntlayerContext();

	const t = useIntlayer("booking-search-bar-calendar-popover");

	const formatDate = useMemo(() => {
		if (!checkInDate) return t.whenAreYouGoing.value;
		if (checkInDate && !checkOutDate)
			return `${date(checkInDate, { dateStyle: "medium", locale })} - ${t.checkoutDate.value}`;
		if (checkInDate && checkOutDate)
			return `${date(checkInDate, { dateStyle: "medium", locale })} - ${date(checkOutDate, { dateStyle: "medium", locale })}`;

		return "";
	}, [
		checkInDate,
		checkOutDate,
		locale,
		t.whenAreYouGoing.value,
		t.checkoutDate.value,
	]);

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant={"outline"}
						className="w-full justify-start font-normal text-base"
						{...buttonsProps}
					/>
				}
			>
				<CalendarDays />
				{formatDate}
			</PopoverTrigger>
			<PopoverContent className="">
				<BookingSearchBarCalendar />
				<BookingNoBookingAfterHoursInfo className="mx-auto mt-4 w-127" />
			</PopoverContent>
		</Popover>
	);
}
