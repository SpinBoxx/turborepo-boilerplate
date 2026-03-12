import { getTranslation } from "intlayer";
import { useIntlayerContext } from "react-intlayer";
import { useHotelContext } from "./HotelProvider";

interface Props {
	display?: "list" | "grid";
}

const HotelAmenityList = ({ display = "list" }: Props) => {
	const { hotel } = useHotelContext();
	const { locale } = useIntlayerContext();

	return (
		<div className="flex flex-col gap-2.5">
			{hotel.amenities.map((amenity) => (
				<div key={amenity.id} className="flex items-center gap-5">
					<span
						className="[&>svg]:size-7 [&>svg]:shrink-0"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: amenity.icon }}
					/>
					<span className="font-normal text-lg">
						{getTranslation(amenity.translations, locale)?.name}
					</span>
				</div>
			))}
		</div>
	);
};

export default HotelAmenityList;
