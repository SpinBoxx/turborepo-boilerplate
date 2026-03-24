import type { HotelComputed } from "@zanadeal/api/features/hotel";
import { cn } from "@zanadeal/ui";
import { MapPin } from "lucide-react";
import HotelName from "../../components/HotelName";
import HotelPricePerNight from "../../components/HotelPricePerNight";
import HotelProvider from "../../components/HotelProvider";

interface Props {
	selected: boolean;
	hotel: HotelComputed;
}

export default function HotelMarker({ selected, hotel }: Props) {
	return (
		<HotelProvider hotel={hotel}>
			<div
				className={cn(
					"flex min-w-28 items-center gap-2 rounded-full border border-border bg-background px-4 py-1 text-foreground shadow-sm transition-all",
					selected && "border-primary shadow-md",
				)}
			>
				<MapPin className="size-4 shrink-0" />
				<div className="min-w-0">
					<HotelName className="font-semibold text-xs" />
					<HotelPricePerNight
						className="items-center"
						priceClassName="text-sm"
						nightClassName="text-xs translate-y-0"
					/>
				</div>
			</div>
		</HotelProvider>
	);
}
