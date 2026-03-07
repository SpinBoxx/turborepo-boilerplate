import type { HotelAdminComputed } from "@zanadeal/api/features/hotel";
import { cn } from "@zanadeal/ui";
import { useHotelListContext } from "../hooks/useHotelListParams";
import HotelCard from "./HotelCard";
import HotelEmptyState from "./HotelEmptyState";
import HotelRow from "./HotelRow";
import HotelsLoading from "./HotelsLoading";

interface Props {
	onHotelClick: (hotel: HotelAdminComputed) => void;
}

export default function HotelList({ onHotelClick }: Props) {
	const { hotels, viewMode, isPending, isError, errorMessage } =
		useHotelListContext();
	if (isPending) return <HotelsLoading />;

	if (isError) {
		return <div className="text-destructive text-sm">{errorMessage}</div>;
	}

	if (hotels.length === 0) return <HotelEmptyState />;

	if (viewMode === "grid") {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{hotels.map((hotel) => (
					<HotelCard
						key={hotel.id}
						hotel={hotel}
						onClick={() => onHotelClick(hotel)}
					/>
				))}
			</div>
		);
	}

	return (
		<div className={cn("grid gap-3 md:grid-cols-2 lg:grid-cols-3")}>
			{hotels.map((hotel) => (
				<HotelRow
					key={hotel.id}
					hotel={hotel}
					onClick={() => onHotelClick(hotel)}
				/>
			))}
		</div>
	);
}
