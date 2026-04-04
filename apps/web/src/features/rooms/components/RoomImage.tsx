import { BedDouble } from "lucide-react";
import type { ComponentProps } from "react";
import { buildCloudinaryImage, type CloudinaryVariant } from "@/lib/cloudinary";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"img"> {
	variant?: CloudinaryVariant;
}

export default function RoomPreviewImage({
	className,
	variant = "listing-card",
	...props
}: Props) {
	const { room } = useRoomContext();
	const image = room.images?.[0];
	if (!image) {
		return (
			<div className={className} style={{ backgroundColor: "var(--muted)" }} />
		);
	}

	const { src, srcSet } = buildCloudinaryImage(
		{ publicId: image.publicId },
		{
			variant,
			responsiveWidths: [400, 600, 800],
		},
	);
	return (
		<img
			className={className}
			{...props}
			src={src}
			srcSet={srcSet}
			alt={room.title || room.type}
		/>
	);
}
