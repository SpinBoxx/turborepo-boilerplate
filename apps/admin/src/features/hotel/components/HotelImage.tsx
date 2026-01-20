import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"img"> {}

export function HotelImage({ className, ...props }: Props) {
	const { hotel } = useHotelContext();

	return (
		<img
			{...props}
			src={hotel.images[0]?.url}
			alt={hotel.name}
			className={className}
			loading="lazy"
		/>
	);
}
