import type { ComponentProps } from "react";
import { useIntlayerContext } from "react-intlayer";
import MarkdownDescription from "@/components/markdown/MarkdownDescription";
import { cn } from "@/lib/utils";
import { getLocalizedRoomDescription } from "../services/room-description.service";
import { useRoomContext } from "./RoomProvider";

export default function RoomDescription({
	className,
	children,
	...props
}: Omit<ComponentProps<"div">, "children"> & { children?: string }) {
	const { room } = useRoomContext();
	const { locale } = useIntlayerContext();
	const description =
		children ?? getLocalizedRoomDescription(room.descriptionTranslations, locale);

	return (
		<MarkdownDescription
			className={cn(
				"line-clamp-3 text-muted-foreground text-sm leading-snug md:text-sm",
				className,
			)}
			{...props}
		>
			{description}
		</MarkdownDescription>
	);
}
