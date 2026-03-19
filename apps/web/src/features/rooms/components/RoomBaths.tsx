import { cn } from "@zanadeal/ui";
import { BathIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { Badge } from "@/components/ui/badge";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {
	variant?: "text" | "badge";
	size?: "normal" | "lg";
}

export default function RoomBaths({
	className,
	variant = "text",
	size,
	...props
}: Props) {
	const { room } = useRoomContext();
	const t = useIntlayer("room-baths");

	if (variant === "badge") {
		return (
			<Badge variant={"outline"} size={"lg"}>
				<BathIcon className="mr-1.5 size-5" />
				{room.baths} {t.baths(room.baths)}
			</Badge>
		);
	}

	return (
		<div
			className={cn("flex shrink-0 items-center gap-1", className)}
			{...props}
		>
			<BathIcon className="mr-1.5 size-5" />
			<div className="flex flex-row items-center gap-1 font-medium">
				{room.baths} {t.baths(room.baths)}
			</div>
		</div>
	);
}
