import type { Room } from "@zanadeal/api/features/room/room.schemas";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Separator,
} from "@zanadeal/ui";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import UpsertRoomForm from "../../forms/UpsertRoom/UpsertRoomForm";

interface Props {
	room?: Room;
	hotelId: string;
	children?: ReactNode;
	open?: boolean;
	onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export default function UpsertRoomDialog({
	room,
	hotelId,
	children,
	open,
	onOpenChange,
}: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{room ? `Modifier la chambre ${room.type}` : "Creer une chambre"}
					</DialogTitle>
				</DialogHeader>
				<Separator className="my-2" />
				<UpsertRoomForm room={room} hotelId={hotelId} />
			</DialogContent>
		</Dialog>
	);
}
