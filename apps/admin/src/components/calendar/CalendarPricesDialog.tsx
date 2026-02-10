import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zanadeal/ui";
import type { ReactNode } from "react";
import {
	type CalendarPrices,
	CalendarWithPrices,
} from "@/components/calendar/CalendarWithPrices";

interface Props {
	children?: ReactNode;
	prices: CalendarPrices;
}

export default function CalendarPricesDialog({ children, prices }: Props) {
	return (
		<Dialog>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="sm:max-w-fit">
				<DialogHeader>
					<DialogTitle>Calendrier des prix</DialogTitle>
				</DialogHeader>

				<CalendarWithPrices className="mt-5" prices={prices} />
			</DialogContent>
		</Dialog>
	);
}
