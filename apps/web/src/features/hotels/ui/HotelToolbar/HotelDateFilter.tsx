import { dateToString, stringToDate } from "@zanadeal/utils";
import { addDays } from "date-fns";
import { date } from "intlayer";
import { CalendarDays } from "lucide-react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { getNextBookableDate } from "@/features/booking/services/booking.service";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

export default function HotelDateFilter() {
	const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } =
		useBookingStore();
	const onSearchChange = useHotelToolbarStore(
		(state) => state.onSearchChange,
	);
	const { locale } = useIntlayerContext();
	const t = useIntlayer("hotel-filters-drawer");
	const firstBookableDate = getNextBookableDate();

	return (
		<section className="space-y-3">
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
				{t.travelDates.value}
			</p>
			<div className="grid grid-cols-2 gap-3">
				<div className="space-y-1.5">
					<p className="text-muted-foreground text-xs">
						{t.checkIn.value}
					</p>
					<Popover>
						<PopoverTrigger
							render={
								<Button
									variant="outline"
									className="w-full justify-start font-normal text-sm"
								/>
							}
						>
							<CalendarDays className="size-4" />
							{date(checkInDate, { dateStyle: "medium", locale })}
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={stringToDate(checkInDate)}
								onSelect={(day) => {
									if (!day) return;
									setCheckInDate(day);
									const newCheckIn = dateToString(day);
									let newCheckOut = checkOutDate ?? "";
									if (
										checkOutDate &&
										day >= stringToDate(checkOutDate)
									) {
										const nextDay = addDays(day, 1);
										setCheckOutDate(nextDay);
										newCheckOut = dateToString(nextDay);
									}
									onSearchChange?.({
										checkIn: newCheckIn,
										checkOut: newCheckOut,
										page: 1,
									});
								}}
								disabled={{ before: firstBookableDate }}
								required
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="space-y-1.5">
					<p className="text-muted-foreground text-xs">
						{t.checkOut.value}
					</p>
					<Popover>
						<PopoverTrigger
							render={
								<Button
									variant="outline"
									className="w-full justify-start font-normal text-sm"
								/>
							}
						>
							<CalendarDays className="size-4" />
							{checkOutDate
								? date(checkOutDate, {
										dateStyle: "medium",
										locale,
									})
								: t.selectDate.value}
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={
									checkOutDate
										? stringToDate(checkOutDate)
										: undefined
								}
								onSelect={(day) => {
									if (!day) return;
									setCheckOutDate(day);
									onSearchChange?.({
										checkOut: dateToString(day),
										page: 1,
									});
								}}
								disabled={{
									before: addDays(
										stringToDate(checkInDate),
										1,
									),
								}}
								required
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</section>
	);
}
