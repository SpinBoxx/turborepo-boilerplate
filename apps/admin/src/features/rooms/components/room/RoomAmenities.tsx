import { Badge, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {}

export default function RoomAmenities({ className, ...props }: Props) {
	const { room } = useRoomContext();
	const { amenities } = room;

	if (amenities.length === 0) return null;

	return (
		<div className={cn("flex flex-wrap gap-1.5", className)} {...props}>
			{amenities.map((amenity) => (
				<Badge key={amenity.id} variant="secondary" className="text-xs">
					{amenity.name}
				</Badge>
			))}
		</div>
	);
}
