import { cn } from "@zanadeal/ui";
import { MapPin } from "lucide-react";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"div"> {}

export function HotelAddress({ className, ...props }: Props) {
	const { hotel } = useHotelContext();
	return (
		<div
			className={cn(
				"flex w-auto items-center gap-1 truncate text-muted-foreground text-xs md:gap-2 md:text-md",
				className,
			)}
			{...props}
		>
			<MapPin className="size-4 shrink-0 text-primary" />
			<span className="">{hotel.address}</span>
		</div>
	);
}
