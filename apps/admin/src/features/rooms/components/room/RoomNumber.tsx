import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"span"> {}

export default function RoomNumber({ className, ...props }: Props) {
	const { room } = useRoomContext();

	return (
		<span
			className={cn("font-bold text-2xl text-white drop-shadow-md", className)}
			{...props}
		>
			#{room.quantity}
		</span>
	);
}
