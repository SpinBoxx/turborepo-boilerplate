import { getTranslation } from "intlayer";
import { useIntlayerContext } from "react-intlayer";
import { useRoomContext } from "./RoomProvider";

interface Props {
	display?: "list" | "grid";
}

export default function RoomAmenityList({ display = "list" }: Props) {
	const { room } = useRoomContext();
	const { locale } = useIntlayerContext();

	return (
		<div
			className={
				display === "grid"
					? "sm:grid-cols- grid grid-cols-1 gap-3"
					: "flex flex-col gap-2.5"
			}
		>
			{room.amenities.map((amenity) => (
				<div key={amenity.id} className="flex items-center gap-5">
					<span
						className="[&>svg]:size-7 [&>svg]:shrink-0"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: amenity icons are stored as trusted SVG strings.
						dangerouslySetInnerHTML={{ __html: amenity.icon }}
					/>
					<span className="font-normal text-lg">
						{getTranslation(amenity.translations, locale)?.name}
					</span>
				</div>
			))}
		</div>
	);
}
