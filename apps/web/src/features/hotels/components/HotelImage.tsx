import type { ComponentProps } from "react";
import { buildCloudinaryImage } from "@/lib/cloudinary";
import { useHotelContext } from "./HotelProvider";

export default function HotelImage({
	className,
	...props
}: ComponentProps<"img">) {
	const { hotel } = useHotelContext();
	const image = hotel.images?.[0];

	if (!image) {
		return (
			<div className={className} style={{ backgroundColor: "var(--muted)" }} />
		);
	}

	const { src, srcSet } = buildCloudinaryImage(
		{ url: image.url, publicId: image.publicId },
		{
			variant: "listing-card",
			responsiveWidths: [400, 600, 800],
		},
	);

	return (
		<img
			src={src}
			srcSet={srcSet}
			sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
			alt={hotel.name}
			loading="lazy"
			className={className}
			{...props}
		/>
	);
}
