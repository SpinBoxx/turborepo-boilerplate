import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

export default function HotelDescription({
	className,
	...props
}: ComponentProps<"span">) {
	const { hotel } = useHotelContext();
	return (
		<span className={className} {...props}>
			{hotel.description}
		</span>
	);
}
