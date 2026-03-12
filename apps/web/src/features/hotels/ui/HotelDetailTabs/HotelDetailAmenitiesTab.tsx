import HotelAmenityList from "../../components/HotelAmenityList";
import HotelDetailSectionTitle from "./HotelDetailSectionTitle";

const HotelDetailAmenitiesTab = () => {
	return (
		<div className="space-y-5">
			<HotelDetailSectionTitle>Ce que propose l'hôtel</HotelDetailSectionTitle>
			<HotelAmenityList />
		</div>
	);
};

export default HotelDetailAmenitiesTab;
