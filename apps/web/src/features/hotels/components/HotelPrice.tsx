import { formatPrice } from "@zanadeal/utils";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

export default function HotelPrice({
	className,
	...props
}: ComponentProps<"span">) {
	const { hotel } = useHotelContext();
	return (
		<span className={className} {...props}>
			{formatPrice(hotel.startingPrice)}
		</span>
	);
}
