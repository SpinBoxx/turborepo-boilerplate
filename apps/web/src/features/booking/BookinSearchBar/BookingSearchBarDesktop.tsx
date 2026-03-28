import { Search } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { useIntlayer } from "react-intlayer";
import TmpText from "@/components/TempText";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
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

	const { validateBooking } = useBookingStore();
	const [error, setError] = useState<string | null>(null);
	const [errorTrigger, setErrorTrigger] = useState(0);
	const t = useIntlayer("booking-translations");

	return (
		<Card
			className={cn("flex flex-col sm:w-4/5 sm:flex-row", className)}
			{...props}
		>
			<CardPanel>
				<div className="flex flex-col gap-2 sm:w-full sm:flex-row">
					<div className="flex-1">
						<p className="font-semibold text-lg">{t.checkIn.value}</p>
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
					<Button
						className={cn("mt-2 sm:mt-0 sm:self-end", actionButtonClassName)}
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
						<Search className="hidden text-white opacity-100 md:block md:size-6" />
						{label || t.search.value}
					</Button>
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
