import { MapPin } from "lucide-react";
import { useHotelCard } from "./HotelCardProvider";

export function HotelAddress({ className }: { className?: string }) {
	const { hotel } = useHotelCard();
	return (
		<div className={className}>
			<MapPin className="size-4 text-primary" />
			<span className="truncate">{hotel.address}</span>
		</div>
	);
}
