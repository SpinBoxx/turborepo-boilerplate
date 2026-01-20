import { Badge, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelCardProvider";

interface Props extends ComponentProps<"div"> {
	max?: number;
}

export function HotelAmenities({ max = 3, className, ...props }: Props) {
	const { hotel } = useHotelContext();
	const amenities = hotel.amenities ?? [];
	if (amenities.length === 0) return null;

	return (
		<div className={cn("flex flex-wrap gap-2", className)} {...props}>
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
