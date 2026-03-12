import { cn } from "@zanadeal/ui";
import { formatPrice } from "@zanadeal/utils";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"span"> {
	priceClassName?: string;
	nightClassName?: string;
}

export default function HotelPricePerNight({
	className,
	priceClassName,
	nightClassName,
	...props
}: Props) {
	const { hotel } = useHotelContext();
	return (
		<div className={cn("flex items-center gap-1", className)}>
			<span
				className={cn("font-bold text-2xl text-primary", priceClassName)}
				{...props}
			>
				{formatPrice(hotel.startingPrice)}
			</span>
			<span
				className={cn(
					"translate-y-0.5 font-normal text-muted-foreground text-sm",
					nightClassName,
				)}
			>
				/night
			</span>
		</div>
	);
}
