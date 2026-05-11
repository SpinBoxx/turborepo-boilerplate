import { cn } from "@zanadeal/ui";
import { currency } from "@zanadeal/utils";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
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
	const t = useIntlayer("hotel-price-per-night");

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<span
				className={cn("font-bold text-2xl text-primary", priceClassName)}
				{...props}
			>
				{currency(hotel.startingPrice)}
			</span>
			<span
				className={cn(
					"translate-y-0.5 font-normal text-muted-foreground text-sm",
					nightClassName,
				)}
			>
				{t.perNight.value}
			</span>
		</div>
	);
}
