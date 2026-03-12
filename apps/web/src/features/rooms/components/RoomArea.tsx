import { Move } from "lucide-react";
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

export default function RoomArea({ label, value, ...props }: Props) {
	if (value == null) {
		return null;
	}

	return (
		<RoomInfoItem icon={Move} label={label ?? "m²"} value={value} {...props} />
	);
}
