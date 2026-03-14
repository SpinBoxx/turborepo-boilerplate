import { BedDouble } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import RoomInfoItem from "./RoomInfoItem";
import { useRoomContext } from "./RoomProvider";

interface Props
	extends Omit<
		ComponentProps<typeof RoomInfoItem>,
		"icon" | "label" | "value"
	> {
	label?: ReactNode;
	value?: ReactNode;
}

export default function RoomBeds({ label, value, ...props }: Props) {
	const { room } = useRoomContext();
	const resolvedValue = value ?? room.beds;

	return (
		<RoomInfoItem
			icon={BedDouble}
			label={label ?? (room.beds > 1 ? "Beds" : "Bed")}
			value={resolvedValue}
			{...props}
		/>
	);
}
