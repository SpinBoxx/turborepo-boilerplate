import type { RoomAdminComputed } from "@zanadeal/api/features/room";
import { Button, Card, cn } from "@zanadeal/ui";
import { Calendar, Pen, Trash2 } from "lucide-react";
import type { ComponentProps } from "react";
import DeleteRoomAlertDialog from "../../ui/alert-dialogs/DeleteRoomAlertDialog";
import RoomAmenities from "./RoomAmenities";
import RoomDescription from "./RoomDescription";
import RoomImage from "./RoomImage";
import RoomPrice from "./RoomPrice";
import RoomPricesCalendarButton from "./RoomPricesCalendarButton";
import { RoomProvider } from "./RoomProvider";
import RoomType from "./RoomType";
import RoomUpdateButton from "./RoomUpdateButton";

interface Props extends ComponentProps<"div"> {
	room: RoomAdminComputed;
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
				<div className="mt-auto flex w-full space-x-2">
					<RoomUpdateButton buttonProps={{ variant: "secondary" }}>
						<Pen />
					</RoomUpdateButton>
					<RoomPricesCalendarButton buttonProps={{ variant: "secondary" }}>
						<Calendar />
					</RoomPricesCalendarButton>
					<DeleteRoomAlertDialog className="ml-auto" id={room.id}>
						<Button variant={"destructive"} size={"icon"} className="ml-auto">
							<Trash2 />
						</Button>
					</DeleteRoomAlertDialog>
				</div>
			</Card>
		</RoomProvider>
	);
}
