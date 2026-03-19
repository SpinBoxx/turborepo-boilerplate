import { cn } from "@zanadeal/ui";
import { Flag } from "lucide-react";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { Badge } from "@/components/ui/badge";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {
	variant?: "text" | "badge";
	size?: "normal" | "lg";
}

export default function RoomQuantity({
	className,
	variant = "text",
	size,
	...props
}: Props) {
	const { room } = useRoomContext();
	const t = useIntlayer("room-quantity");

	if (variant === "badge") {
		return (
			<Badge variant={"info"} size={"lg"} className="">
				<Flag className="mr-1.5 size-5" />
				{room.quantity} {t.quantity(room.quantity)}
			</Badge>
		);
	}

	return (
		<div
			className={cn("flex shrink-0 items-center gap-1", className)}
			{...props}
		>
			<Flag className="mr-1.5 size-5" />
			<div className="flex flex-row items-center gap-1 font-medium">
				{room.quantity} {t.quantity(room.quantity)}
			</div>
		</div>
	);
}
