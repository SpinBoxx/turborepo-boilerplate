import { Button, type ButtonVariants, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import UpsertRoomDialog from "../dialogs/UpsertRoomDialog";
import { useRoomContext } from "./RoomProvider";

interface Props extends Omit<ComponentProps<"button">, "onClick"> {
	buttonProps: ButtonVariants;
}

export default function RoomUpdateButton({
	className,
	children,
	buttonProps,
	...props
}: Props) {
	const { room } = useRoomContext();

	return (
		<UpsertRoomDialog hotelId={room.hotelId} room={room}>
			<Button {...props} {...buttonProps} className={cn("", className)}>
				{children}
			</Button>
		</UpsertRoomDialog>
	);
}
