import { Bath } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import RoomInfoItem from "./RoomInfoItem";

interface Props
	extends Omit<
		ComponentProps<typeof RoomInfoItem>,
		"icon" | "label" | "value"
	> {
	label?: ReactNode;
	value?: ReactNode;
}

export default function RoomBaths({ label, value, ...props }: Props) {
	if (value == null) {
		return null;
	}

	return (
		<RoomInfoItem
			icon={Bath}
			label={label ?? (value === 1 ? "Bath" : "Baths")}
			value={value}
			{...props}
		/>
	);
}
