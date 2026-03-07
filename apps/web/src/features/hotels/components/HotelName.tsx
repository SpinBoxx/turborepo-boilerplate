import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

export default function HotelName({
	className,
	...props
}: ComponentProps<"h2">) {
	const { hotel } = useHotelContext();
	return (
		<h2 className={className} {...props}>
			{hotel.name}
		</h2>
	);
}
