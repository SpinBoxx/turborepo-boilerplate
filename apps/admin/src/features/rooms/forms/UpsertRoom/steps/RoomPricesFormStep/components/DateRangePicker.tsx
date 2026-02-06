"use client";

import {
	Button,
	Calendar,
	cn,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@zanadeal/ui";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
	dateRange: DateRange | undefined;
	onDateRangeChange: (range: DateRange | undefined) => void;
	className?: string;
}

export default function DateRangePicker({
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
							"w-[45%] justify-start gap-2 text-left font-normal",
							!dateRange?.from && "text-muted-foreground",
						)}
					>
						<span className="text-muted-foreground text-xs">DU</span>
						<span className="flex-1">{formatDate(dateRange?.from)}</span>
						<CalendarIcon className="size-4 text-muted-foreground" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						selected={dateRange}
						onSelect={onDateRangeChange}
						numberOfMonths={2}
						locale={fr}
					/>
				</PopoverContent>
			</Popover>

			<ArrowRight className="size-4 shrink-0 text-muted-foreground" />

			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							"w-[45%] justify-start gap-2 text-left font-normal",
							!dateRange?.to && "text-muted-foreground",
						)}
					>
						<span className="text-muted-foreground text-xs">AU</span>
						<span className="flex-1">{formatDate(dateRange?.to)}</span>
						<CalendarIcon className="size-4 text-muted-foreground" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						selected={dateRange}
						onSelect={onDateRangeChange}
						numberOfMonths={2}
						locale={fr}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
