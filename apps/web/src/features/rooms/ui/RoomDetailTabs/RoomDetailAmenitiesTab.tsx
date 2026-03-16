import RoomAmenityList from "../../components/RoomAmenityList";
import RoomDetailSectionTitle from "./RoomDetailSectionTitle";

export default function RoomDetailAmenitiesTab() {
	return (
		<div className="space-y-5">
			<RoomDetailSectionTitle>What this room offers</RoomDetailSectionTitle>
			<RoomAmenityList display="grid" />
		</div>
	);
}
