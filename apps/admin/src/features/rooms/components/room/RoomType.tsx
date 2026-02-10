import { Badge, cn } from "@zanadeal/ui";
import { Stars } from "lucide-react";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {}

export default function RoomType({ className, ...props }: Props) {
	const { room } = useRoomContext();

	const isPremium = room.type === "PREMIUM";

	return (
		<Badge
			variant="secondary"
			className={cn(
				"font-semibold text-xs capitalize tracking-wider backdrop-blur-sm",
				isPremium
					? "border-amber-500/40 bg-linear-to-r from-amber-500/80 to-yellow-400/80 text-white"
					: "bg-background/60",
				className,
			)}
			{...props}
		>
			{room.type === "PREMIUM" && <Stars className="fill-white" />}
			{room.type.toLowerCase()}
		</Badge>
	);
}
