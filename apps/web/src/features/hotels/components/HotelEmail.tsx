import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

export default function HotelEmail({
	className,
	...props
}: ComponentProps<"span">) {
	const { hotel } = useHotelContext();
	return (
		<span className={className} {...props}>
			{hotel.email}
		</span>
	);
}
