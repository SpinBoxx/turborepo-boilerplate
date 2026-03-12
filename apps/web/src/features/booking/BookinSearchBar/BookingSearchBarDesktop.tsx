import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import CalendarWithComboBox from "@/components/calendar/CalendarWithComboBox";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BookingGuestCountInput from "../ui/BookingGuestCountInput";

interface Props extends ComponentProps<"div"> {
	guestsInputClassName?: string;
	actionButton?: {
		label?: string;
		className?: string;
		onClick?: () => void;
	};
}

export default function BookingSearchBarDesktop({
	className,
	guestsInputClassName,
	actionButton,
	...props
}: Props) {
	const {
		className: actionButtonClassName,
		label,
		onClick,
	} = actionButton || {};
	return (
		<Card
			className={cn("flex flex-col sm:w-4/5 sm:flex-row", className)}
			{...props}
		>
			<CardPanel>
				<div className="flex flex-col gap-2 sm:w-full sm:flex-row">
					<div className="flex-1">
						<p className="font-semibold text-lg">Check-in</p>
						<CalendarWithComboBox
							placeholder="Arrival"
							triggerProps={{
								className: "!font-normal !text-base !text-muted-foreground",
								size: "xl",
							}}
						/>
					</div>
					<div className="flex-1">
						<p className="font-semibold text-lg">Check-out</p>
						<CalendarWithComboBox
							placeholder="Departure"
							triggerProps={{
								size: "xl",
								className: "!font-normal !text-base !text-muted-foreground",
							}}
						/>
					</div>
					<div
						className={cn("flex-none font-no sm:w-32", guestsInputClassName)}
					>
						<p className="font-semibold text-lg">Guests</p>
						<BookingGuestCountInput />
					</div>
					<Button
						className={cn("mt-2 sm:mt-0 sm:self-end", actionButtonClassName)}
						size={"xl"}
						onClick={onClick}
					>
						<Search className="hidden text-white opacity-100 md:block md:size-6" />
						{label || "Search"}
					</Button>
				</div>
			</CardPanel>
		</Card>
	);
}
