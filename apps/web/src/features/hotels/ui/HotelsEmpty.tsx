import { CalendarX2Icon, HotelIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";

interface HotelsEmptyProps {
	hasDates: boolean;
}

export default function HotelsEmpty({ hasDates }: HotelsEmptyProps) {
	const t = useIntlayer("hotels-empty");

	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 border-dashed bg-card/70 px-6 py-16 text-center">
			{hasDates ? (
				<>
					<CalendarX2Icon className="size-8 text-muted-foreground" />
					<h2 className="font-semibold text-xl">
						{t.noHotelForDates.value}
					</h2>
					<p className="max-w-xl text-muted-foreground">
						{t.noHotelForDatesDescription.value}
					</p>
				</>
			) : (
				<>
					<HotelIcon className="size-8 text-muted-foreground" />
					<h2 className="font-semibold text-xl">
						{t.noHotelFound.value}
					</h2>
					<p className="max-w-xl text-muted-foreground">
						{t.noHotelFoundDescription.value}
					</p>
				</>
			)}
		</div>
	);
}
