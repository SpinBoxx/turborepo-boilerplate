import { useHotelCard } from "./HotelCardProvider";

export function HotelImage({ className }: { className?: string }) {
	const { hotel } = useHotelCard();

	return (
		<img
			src={hotel.images[0]?.url}
			alt={hotel.name}
			className={className}
			loading="lazy"
		/>
	);
}
