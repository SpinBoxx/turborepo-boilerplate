import { currency } from "@zanadeal/utils";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"span"> {
	price?: number;
}

export default function RoomPriceBadge({ className, price, ...props }: Props) {
	const { room } = useRoomContext();
	const resolvedPrice =
		price ?? (room.promoPrice > 0 ? room.promoPrice : room.price);

	return (
		<span
			className={cn(
				"inline-flex h-fit shrink-0 items-center rounded-full bg-muted px-4 py-2 font-light text-base text-foreground tracking-[-0.03em] md:px-5 md:text-[1.35rem]",
				className,
			)}
			{...props}
		>
			{currency(resolvedPrice)}
		</span>
	);
}
