import { Bath } from "lucide-react";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

export default function RoomBaths({
	className,
	...props
}: ComponentProps<"span">) {
	const { room } = useRoomContext();

	return (
		<span className={className} {...props}>
			<Bath className="inline size-4" /> 4 Baths
		</span>
	);
}
