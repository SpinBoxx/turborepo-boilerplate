import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useRoomContext } from "./RoomProvider";

export default function RoomDescription({
	className,
	children,
	...props
}: ComponentProps<"p">) {
	const { room } = useRoomContext();

	return (
		<p
			className={cn(
				"line-clamp-3 text-[1.05rem] text-muted-foreground leading-snug md:text-[1.15rem]",
				className,
			)}
			{...props}
		>
			{children ?? room.description}
		</p>
	);
}
