import type { RoomComputed } from "@zanadeal/api/features/room/room.schemas";
import { Card, cn } from "@zanadeal/ui";
import { Calendar, Pen } from "lucide-react";
import type { ComponentProps } from "react";
import RoomAmenities from "./RoomAmenities";
import RoomDescription from "./RoomDescription";
import RoomImage from "./RoomImage";
import RoomPrice from "./RoomPrice";
import RoomPricesCalendarButton from "./RoomPricesCalendarButton";
import { RoomProvider } from "./RoomProvider";
import RoomType from "./RoomType";
import RoomUpdateButton from "./RoomUpdateButton";

interface Props extends ComponentProps<"div"> {
	room: RoomComputed;
}

export default function RoomCard({ room, className, ...props }: Props) {
	return (
		<RoomProvider room={room}>
			<Card className={cn("gap-3 p-2", className)} {...props}>
				{/* Image section with overlays */}
				<div className="relative">
					<RoomImage />
					<div className="absolute top-4 right-4">
						<RoomType />
					</div>
				</div>

				{/* Info section */}
				<div className="flex flex-col gap-2 px-2">
					<RoomDescription />
					<RoomPrice />
					<RoomAmenities />
				</div>
				<div className="mt-auto space-x-2">
					<RoomUpdateButton buttonProps={{ variant: "secondary" }}>
						<Pen />
					</RoomUpdateButton>
					<RoomPricesCalendarButton buttonProps={{ variant: "secondary" }}>
						<Calendar />
					</RoomPricesCalendarButton>
				</div>
			</Card>
		</RoomProvider>
	);
}
