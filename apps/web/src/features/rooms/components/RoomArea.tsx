import { Move } from "lucide-react";
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

export default function RoomArea({ label, value, ...props }: Props) {
	const { room } = useRoomContext();
	const resolvedValue = value ?? room.areaM2;

	if (resolvedValue == null) {
		return null;
	}

	return (
		<RoomInfoItem
			icon={Move}
			label={label ?? "m²"}
			value={resolvedValue}
			{...props}
		/>
	);
}
