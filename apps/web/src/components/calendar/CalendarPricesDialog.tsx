import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zanadeal/ui";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import {
	type CalendarPrices,
	CalendarWithPrices,
} from "@/components/calendar/CalendarWithPrices";

interface Props {
	children?: ReactNode;
	prices: CalendarPrices;
}

export default function CalendarPricesDialog({ children, prices }: Props) {
	const t = useIntlayer("calendar-prices");

	return (
		<Dialog>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="sm:max-w-fit">
				<DialogHeader>
					<DialogTitle>{t.priceCalendar.value}</DialogTitle>
				</DialogHeader>

				<CalendarWithPrices className="mt-5" prices={prices} />
			</DialogContent>
		</Dialog>
	);
}
