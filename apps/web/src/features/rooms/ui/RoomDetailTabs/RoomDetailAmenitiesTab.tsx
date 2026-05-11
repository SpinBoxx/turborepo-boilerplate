import { useIntlayer } from "react-intlayer";
import RoomAmenityList from "../../components/RoomAmenityList";
import RoomDetailSectionTitle from "./RoomDetailSectionTitle";

export default function RoomDetailAmenitiesTab() {
	const t = useIntlayer("room-detail");

	return (
		<div className="space-y-5">
			<RoomDetailSectionTitle>{t.roomOffers.value}</RoomDetailSectionTitle>
			<RoomAmenityList display="grid" />
		</div>
	);
}
