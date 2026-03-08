import { Move } from "lucide-react";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

export default function RoomArea({
	className,
	...props
}: ComponentProps<"span">) {
	const { room } = useRoomContext();

	return (
		<span className={className} {...props}>
			<Move className="inline size-4" /> 44 m²
		</span>
	);
}
