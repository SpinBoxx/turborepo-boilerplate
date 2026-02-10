import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"img"> {}

export default function RoomImage({ className, ...props }: Props) {
	const { room } = useRoomContext();
	const image = room.images[0];

	if (!image) {
		return (
			<div
				className={cn(
					"flex aspect-square w-full items-center justify-center rounded-lg bg-muted",
					className,
				)}
			>
				<span className="text-muted-foreground text-sm">No image</span>
			</div>
		);
	}

	return (
		<img
			src={image.url}
			alt={`Room #${room.quantity}`}
			className={cn("aspect-square w-full rounded-lg object-cover", className)}
			{...props}
		/>
	);
}
