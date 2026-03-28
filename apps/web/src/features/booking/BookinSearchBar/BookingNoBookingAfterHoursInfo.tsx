import { AlertCircleIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { cn } from "@/lib/utils";
import { canBookForToday } from "../services/booking.service";

type BookingNoBookingAfterHoursInfoProps = {
	className?: string;
};

export default function BookingNoBookingAfterHoursInfo({
	className,
}: BookingNoBookingAfterHoursInfoProps) {
	const t = useIntlayer("booking-no-booking-after-hours-info");

	if (canBookForToday()) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3 text-sm",
				className,
			)}
			aria-live="polite"
		>
			<AlertCircleIcon
				className="mt-0.5 size-5 flex-none text-muted-foreground"
				aria-hidden="true"
			/>
			<div className="space-y-1">
				<p className="text-pretty font-medium text-foreground">
					{t.title.value}
				</p>
				<p className="text-pretty text-muted-foreground">
					{t.description.value}
				</p>
			</div>
		</div>
	);
}
