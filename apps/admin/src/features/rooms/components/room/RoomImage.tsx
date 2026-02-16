import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { buildCloudinaryImage } from "@/lib/cloudinary";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"img"> {}

export default function RoomImage({ className, ...props }: Props) {
	const { room } = useRoomContext();
	const image = room.images[0];
	const transformed = buildCloudinaryImage(image, {
		variant: "room-thumbnail",
		responsiveWidths: [200, 300, 400, 600],
	});

	if (!image) {
		return (
			<div
				className={cn(
					"flex aspect-square w-full items-center justify-center rounded-lg bg-muted",
					className,
				)}
			>
				<span className="text-muted-foreground text-sm">No image</span>
			</div>
		);
	}

	return (
		<img
			src={transformed.src ?? image.url}
			srcSet={transformed.srcSet}
			sizes={props.sizes ?? "(max-width: 768px) 100vw, 33vw"}
			alt={`Room #${room.quantity}`}
			className={cn("aspect-square w-full rounded-lg object-cover", className)}
			loading="lazy"
			decoding="async"
			{...props}
		/>
	);
}
