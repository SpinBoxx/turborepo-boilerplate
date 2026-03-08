import { BedDouble } from "lucide-react";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

export default function RoomBeds({
	className,
	...props
}: ComponentProps<"span">) {
	const { room } = useRoomContext();

	return (
		<span className={className} {...props}>
			<BedDouble className="inline size-4" /> 2 Beds
		</span>
	);
}
