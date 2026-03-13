import type { RoomUserComputed } from "@zanadeal/api/features/room";
import { cva, type VariantProps } from "class-variance-authority";
import { Stars } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useRoomContext } from "./RoomProvider";

type RoomTypeValue = RoomUserComputed["type"];

const roomTypeVariants = cva("", {
	defaultVariants: {
		display: "text",
		roomType: "STANDARD",
	},
	variants: {
		display: {
			badge:
				"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold text-sm uppercase tracking-[0.12em]",
			text: "line-clamp-1 font-semibold text-2xl tracking-[-0.045em] md:text-[2rem]",
		},
		roomType: {
			PREMIUM: "",
			STANDARD: "",
		},
	},
	compoundVariants: [
		{
			className:
				"border-border/70 bg-card text-foreground shadow-sm backdrop-blur-sm",
			display: "badge",
			roomType: "STANDARD",
		},
		{
			className:
				"border-amber-300/60 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 text-amber-950 shadow-[0_10px_30px_rgba(245,158,11,0.28)]",
			display: "badge",
			roomType: "PREMIUM",
		},
	],
});

const formatRoomTypeLabel = (roomType: RoomTypeValue) =>
	roomType
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

interface Props
	extends ComponentProps<"h3">,
		VariantProps<typeof roomTypeVariants> {}

export default function RoomType({ className, display, ...props }: Props) {
	const { room } = useRoomContext();

	const isPremiumBadge = display === "badge" && room.type === "PREMIUM";

	return (
		<h3
			className={cn(
				roomTypeVariants({ display, roomType: room.type }),
				className,
			)}
			{...props}
		>
			{isPremiumBadge ? <Stars className="size-4 fill-current" /> : null}
			{formatRoomTypeLabel(room.type)}
		</h3>
	);
}
