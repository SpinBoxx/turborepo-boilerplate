import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelCardProvider";

interface Props extends ComponentProps<"p"> {}

export function HotelDescription({ className, ...props }: Props) {
	const { hotel } = useHotelContext();
	if (!hotel.description) return null;
	return (
		<p
			className={cn("text-muted-foreground text-xs md:text-sm", className)}
			{...props}
		>
			{hotel.description}
		</p>
	);
}
