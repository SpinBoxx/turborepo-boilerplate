import { useHotelCard } from "./HotelCardProvider";

export function HotelDescription({ className }: { className?: string }) {
	const { hotel } = useHotelCard();
	if (!hotel.description) return null;
	return <p className={className}>{hotel.description}</p>;
}
