import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"div"> {}

export function HotelAddress({ className, ...props }: Props) {
	const { hotel } = useHotelContext();
	return (
		<p
			className={cn(
				"truncate text-ellipsis text-muted-foreground text-sm",
				className,
			)}
			{...props}
		>
			{hotel.address}
		</p>
	);
}
