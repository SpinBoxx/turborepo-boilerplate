import { Badge, cn } from "@zanadeal/ui";
import { useHotelCard } from "./HotelCardProvider";

export function HotelAmenities({
	max = 3,
	className,
}: {
	max?: number;
	className?: string;
}) {
	const { hotel } = useHotelCard();
	const amenities = hotel.amenities ?? [];
	if (amenities.length === 0) return null;

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{amenities.slice(0, max).map((a) => (
				<Badge key={a.id} variant="secondary" className="truncate rounded-full">
					{a.name.toUpperCase()}
				</Badge>
			))}
			{amenities.length > max ? (
				<Badge variant="outline" className="rounded-full">
					+{amenities.length - max}
				</Badge>
			) : null}
		</div>
	);
}
