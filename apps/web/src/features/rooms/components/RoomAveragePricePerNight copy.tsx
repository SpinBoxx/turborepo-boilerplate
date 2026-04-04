import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import HotelPricePerNight from "@/features/hotels/components/HotelPricePerNight";
import { cn } from "@/lib/utils";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {
	labelClassName?: string;
	nightClassName?: string;
	price?: number;
	priceClassName?: string;
}

export default function RoomAveragePricePerNight({
	className,
	labelClassName,
	nightClassName,
	price,
	priceClassName,
	...props
}: Props) {
	const { room } = useRoomContext();
	const t = useIntlayer("common");

	return (
		<div className={cn("space-y-1.5", className)} {...props}>
			<div className="flex flex-col gap-0">
				<span className="text-muted-foreground text-xs uppercase">
					{t.averagePrice.value}
				</span>
				<HotelPricePerNight />
			</div>
		</div>
	);
}
