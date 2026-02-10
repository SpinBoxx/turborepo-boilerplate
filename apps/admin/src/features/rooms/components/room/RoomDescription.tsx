import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"p"> {}

export default function RoomDescription({ className, ...props }: Props) {
	const { room } = useRoomContext();

	return (
		<p
			className={cn("line-clamp-3 text-muted-foreground text-sm", className)}
			{...props}
		>
			{room.description}
		</p>
	);
}
