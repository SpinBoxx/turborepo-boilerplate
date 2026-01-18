import { useHotelCard } from "./HotelCardProvider";

export function HotelName({ className }: { className?: string }) {
	const { hotel } = useHotelCard();
	return <p className={className}>{hotel.name}</p>;
}
