import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelCardProvider";

interface Props extends ComponentProps<"p"> {}

export function HotelName({ className, ...props }: Props) {
	const { hotel } = useHotelContext();
	return (
		<p className={cn("text-sm md:text-md", className)} {...props}>
			{hotel.name}
		</p>
	);
}
