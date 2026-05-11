import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {
	type?: "badge" | "overlay" | "text";
	badgeProps?: BadgeProps;
}

export default function RoomAvailableQuantity({
	type = "text",
	className,
	badgeProps,
	...props
}: Props) {
	const { room } = useRoomContext();
	const t = useIntlayer("room-available-quantity");

	if (type === "overlay") {
		return (
			<div
				className={cn(
					"inline-flex max-w-full shrink-0 items-center gap-2 rounded-full border border-white/14 bg-black/58 px-3 py-1.5 text-white shadow-sm backdrop-blur-sm",
					className,
				)}
				{...props}
			>
				<div
					className={cn("min-w-0", "tabular-nums", "text-sm", "leading-none")}
				>
					<div className="truncate font-semibold text-white">
						{t.availableQuantityOverlay(room.availableCapacity)({
							count: room.availableCapacity,
						})}
					</div>
				</div>
			</div>
		);
	}

	if (type === "badge") {
		return (
			<Badge
				variant={room.availableCapacity > 3 ? "default" : "warning"}
				size={"lg"}
				{...badgeProps}
				className={cn("flex shrink-0 items-center gap-1", className)}
			>
				{t.availableQuantity(room.availableCapacity)({
					count: room.availableCapacity,
				})}
			</Badge>
		);
	}

	return (
		<div
			className={cn("flex shrink-0 items-center gap-1", className)}
			{...props}
		>
			<div className="flex flex-row items-center gap-1 font-medium">
				{t.availableQuantity(room.availableCapacity)({
					count: room.availableCapacity,
				})}
			</div>
		</div>
	);
}
