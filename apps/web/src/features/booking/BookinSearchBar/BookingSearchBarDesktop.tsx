import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { useIntlayer } from "react-intlayer";
import TmpText from "@/components/TempText";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "@/features/hotels/ui/HotelToolbar/hotel-toolbar.options";
import { cn } from "@/lib/utils";
import { useBookingStore } from "../hooks/useBookingHook";
import BookingGuestCountInput from "../ui/BookingGuestCountInput";
import { BookingSearchBarCalendarPopover } from "./BookingSearchBarCalendarPopover";

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

	const { validateBooking, checkInDate, checkOutDate } = useBookingStore();
	const [error, setError] = useState<string | null>(null);
	const [errorTrigger, setErrorTrigger] = useState(0);
	const t = useIntlayer("booking-translations");

	return (
		<Card className={cn("flex flex-col", className)} {...props}>
			<CardPanel>
				<div className="flex flex-col gap-2 sm:w-full sm:flex-row">
					<div className="flex-1">
						<p className="font-semibold text-lg">{t.selectTravelDates.value}</p>
						<BookingSearchBarCalendarPopover
							buttonsProps={{
								size: "xl",
							}}
						/>
					</div>
					<div
						className={cn(
							"max-w-48 font-normal sm:w-32 sm:flex-none md:flex-1",
							guestsInputClassName,
						)}
					>
						<p className="font-semibold text-lg">{t.guests.value}</p>
						<BookingGuestCountInput size="xl" />
					</div>
					<Link
						to="/hotels"
						search={{
							...DEFAULT_HOTELS_PAGE_SEARCH,
							checkIn: checkInDate,
							checkOut: checkOutDate ?? "",
						}}
						className="mt-2 sm:mt-0 sm:self-end"
					>
						<Button
							className={cn("", actionButtonClassName)}
							size={"xl"}
							onClick={() => {
								setError(null);
								const result = validateBooking();
								if (!result.success) {
									setError(result.error || null);
									setErrorTrigger((value) => value + 1);
								} else {
									onClick?.();
								}
							}}
						>
							<Search className="text-white opacity-100 md:hidden md:size-6 lg:block" />
							<span className="hidden md:block">{label || t.search.value}</span>
						</Button>
					</Link>
				</div>

				<TmpText
					className="mt-2 text-destructive text-sm"
					trigger={errorTrigger}
				>
					{error}
				</TmpText>
			</CardPanel>
		</Card>
	);
}
