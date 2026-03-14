import { Bath } from "lucide-react";
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

export default function RoomBaths({ label, value, ...props }: Props) {
	const { room } = useRoomContext();
	const resolvedValue = value ?? room.baths;

	if (resolvedValue == null) {
		return null;
	}

	return (
		<RoomInfoItem
			icon={Bath}
			label={label ?? (resolvedValue === 1 ? "Bath" : "Baths")}
			value={resolvedValue}
			{...props}
		/>
	);
}
