import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Save } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverClose,
	PopoverPopup,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useBookingStore } from "../hooks/useBookingHook";
import { BookingSearchBarCalendar } from "./BookingSearchBarCalendar";

interface Props {
	className?: string;
}

export default function BookingSearchBarMobile({ className }: Props) {
	const { checkInDate, checkOutDate } = useBookingStore();

	const [isOpen, setIsOpen] = useState(false);

	const formatDate = useMemo(() => {
		if (!checkInDate) return "When are you going?";
		if (checkInDate && !checkOutDate) return format(checkInDate, "LLL dd, y");
		return `${format(checkInDate, "LLL dd, y")} - ${format(checkOutDate!, "LLL dd, y")}`;
	}, [checkInDate, checkOutDate]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger
				render={
					<Button
						className={cn(
							"w-full justify-start font-normal text-sm",
							className,
						)}
						variant="outline"
					/>
				}
			>
				<CalendarIcon aria-hidden="true" />
				<span className="ml-2 flex-1 text-left">{formatDate}</span>
				<ChevronDown
					aria-hidden="true"
					className={cn(
						"ml-auto transition-transform",
						isOpen ? "rotate-180" : "rotate-0",
					)}
				/>
			</PopoverTrigger>
			<PopoverPopup className={"w-80"}>
				<PopoverTitle className="pb-2 text-center font-normal text-muted-foreground text-sm tracking-tight">
					Select your travel dates
				</PopoverTitle>
				<Separator />
				<BookingSearchBarCalendar className="mt-1.5" />
				<PopoverClose
					className={"mt-2"}
					render={
						<Button
							variant={"outline"}
							size={"sm"}
							className="w-full text-sm"
						/>
					}
				>
					<Save />
					Save my dates
				</PopoverClose>
			</PopoverPopup>
		</Popover>
	);
}
