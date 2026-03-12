import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useRoomContext } from "./RoomProvider";

const formatRoomType = (value: string) =>
	value
		.toLowerCase()
		.split("_")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");

export default function RoomTitle({
	className,
	children,
	...props
}: ComponentProps<"h3">) {
	const { room } = useRoomContext();

	return (
		<h3
			className={cn(
				"line-clamp-1 font-semibold text-2xl tracking-[-0.045em] md:text-[2rem]",
				className,
			)}
			{...props}
		>
			{children ?? formatRoomType(room.type)}
		</h3>
	);
}
