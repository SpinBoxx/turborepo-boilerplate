import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

export default function HotelAddress({
	className,
	...props
}: ComponentProps<"span">) {
	const { hotel } = useHotelContext();
	return (
		<span className={className} {...props}>
			{hotel.address}
		</span>
	);
}
