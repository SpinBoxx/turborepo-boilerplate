"use client";

import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import {
	Button,
	cn,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@zanadeal/ui";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { CalendarRangeWithPrices } from "@/components/calendar/CalendarRangeWithPrices";

interface DateRangePickerProps {
	dateRange: DateRange | undefined;
	onDateRangeChange: (range: DateRange | undefined) => void;
	className?: string;
	prices: CreateRoomPriceInput[];
}

export default function DateRangePicker({
	prices,
	dateRange,
	onDateRangeChange,
	className,
}: DateRangePickerProps) {
	const formatDate = (date: Date | undefined) => {
		if (!date) return "jj/mm/aaaa";
		return format(date, "dd/MM/yyyy", { locale: fr });
	};

	return (
		<div
			className={cn(
				"flex w-full items-center justify-between gap-2",
				className,
			)}
		>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							"w-full justify-start gap-2 text-left font-normal",
							!dateRange?.from && "text-muted-foreground",
						)}
					>
						<span className="text-muted-foreground text-xs">DU</span>
						<span className="flex-1">{formatDate(dateRange?.from)}</span>
						<span className="text-muted-foreground text-xs">AU</span>
						<span className="flex-1">{formatDate(dateRange?.to)}</span>
						<CalendarIcon className="size-4 text-muted-foreground" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<CalendarRangeWithPrices
						prices={prices}
						onSelectFromProps={onDateRangeChange}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
