import { Star } from "lucide-react";
import { useHotelCard } from "./HotelCardProvider";

export function HotelRating() {
	const { hotel } = useHotelCard();

	return (
		<div className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-xs backdrop-blur">
			<Star className="size-3 text-yellow-500" />
			{hotel.rating === 0 ? (
				<span className="font-medium">No reviews yet</span>
			) : (
				<span className="font-medium">{hotel.rating.toFixed(1)}</span>
			)}
		</div>
	);
}
