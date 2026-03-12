import { useState } from "react";
import { useHotelContext } from "../../components/HotelProvider";
import HotelDetailMapSkeleton from "./HotelDetailMapSkeleton";
import HotelDetailSectionTitle from "./HotelDetailSectionTitle";

const HotelDetailMapsTab = () => {
	const { hotel } = useHotelContext();
	const [isMapLoaded, setIsMapLoaded] = useState(false);
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
			<div className="relative overflow-hidden rounded-md">
				{!isMapLoaded && (
					<div className="absolute inset-0 z-10">
						<HotelDetailMapSkeleton />
					</div>
				)}
				<iframe
					title="Hotel Location"
					src={mapSrc}
					onLoad={() => setIsMapLoaded(true)}
					className={`aspect-video w-full rounded-md border-0 transition-opacity duration-300 ${
						isMapLoaded ? "opacity-100" : "opacity-0"
					}`}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					allowFullScreen
				/>
			</div>
		</div>
	);
};

export default HotelDetailMapsTab;
