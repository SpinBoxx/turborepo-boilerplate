import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { buildCloudinaryImage } from "@/lib/cloudinary";
import { useHotelContext } from "./HotelProvider";

interface Props extends ComponentProps<"img"> {
	variant?: "hero" | "listing-card" | "room-thumbnail" | "room-gallery";
	responsiveWidths?: ReadonlyArray<number>;
}

export function HotelImage({
	className,
	variant = "listing-card",
	responsiveWidths,
	...props
}: Props) {
	const { hotel } = useHotelContext();
	const image = hotel.images[0];
	if (!image) return null;
	const transformed = buildCloudinaryImage(image, {
		variant,
		responsiveWidths: responsiveWidths ?? [320, 480, 600, 900],
	});

	return (
		<img
			{...props}
			src={transformed.src}
			srcSet={transformed.srcSet}
			sizes={props.sizes ?? "(max-width: 768px) 100vw, 50vw"}
			alt={hotel.name}
			className={cn("h-full w-full", className)}
			loading="lazy"
			decoding="async"
		/>
	);
}
