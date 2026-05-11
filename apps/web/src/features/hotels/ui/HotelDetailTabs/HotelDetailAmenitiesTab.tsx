import { useIntlayer } from "react-intlayer";
import HotelAmenityList from "../../components/HotelAmenityList";
import HotelDetailSectionTitle from "./HotelDetailSectionTitle";

const HotelDetailAmenitiesTab = () => {
	const t = useIntlayer("hotel-detail");

	return (
		<div className="space-y-5">
			<HotelDetailSectionTitle>{t.hotelOffers.value}</HotelDetailSectionTitle>
			<HotelAmenityList />
		</div>
	);
};

export default HotelDetailAmenitiesTab;
