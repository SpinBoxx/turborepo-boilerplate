import type { ComponentProps } from "react";
import HotelAvailabilityPrice from "./HotelAvailabilityPrice";

export default function HotelPrice({
	className,
	...props
}: ComponentProps<"div">) {
	return <HotelAvailabilityPrice className={className} {...props} />;
}
