import { useHotelContext } from "../../components/HotelProvider";
import HotelDetailSectionTitle from "./HotelDetailSectionTitle";

const HotelDetailMapsTab = () => {
	const { hotel } = useHotelContext();
	const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
	const mapSrc = (() => {
		if (!apiKey) return hotel.mapLink;

		try {
			const url = new URL(hotel.mapLink);
			url.searchParams.set("key", apiKey);
			url.searchParams.set("zoom", "15");
			return url.toString();
		} catch {
			return hotel.mapLink;
		}
	})();

	return (
		<div className="space-y-5">
			<HotelDetailSectionTitle>Ou se situe l'hotel</HotelDetailSectionTitle>
			<p className="text-muted-foreground text-sm">{hotel.address}</p>
			<iframe
				title="Hotel Location"
				src={mapSrc}
				className="aspect-video w-full rounded-md border-0"
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				allowFullScreen
			/>
		</div>
	);
};

export default HotelDetailMapsTab;
