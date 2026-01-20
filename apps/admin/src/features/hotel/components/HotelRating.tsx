import { cn } from "@zanadeal/ui";
import { Star } from "lucide-react";
import type { ComponentProps } from "react";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"div"> {}

export function HotelRating({ className, ...props }: Props) {
	const { hotel } = useHotelContext();

	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-1 text-xs backdrop-blur",
				className,
			)}
			{...props}
		>
			<Star className="size-3 text-yellow-500" />
			{hotel.rating === 0 ? (
				<span className="font-medium">No reviews yet</span>
			) : (
				<span className="font-medium">{hotel.rating.toFixed(1)}</span>
			)}
		</div>
	);
}
