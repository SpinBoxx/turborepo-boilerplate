import type { HotelComputed } from "@zanadeal/api/features/hotel";
import type { MapsPoi } from "@/components/maps/types";

export type HotelMapPoi = MapsPoi & {
	hotel: HotelComputed;
};

function parseCoordinate(value: string): number | null {
	const parsedValue = Number(value);
	return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function hotelToMapPoi(hotel: HotelComputed): HotelMapPoi | null {
	const lat = parseCoordinate(hotel.latitude);
	const lng = parseCoordinate(hotel.longitude);

	if (lat == null || lng == null) {
		return null;
	}

	return {
		key: hotel.id,
		location: { lat, lng },
		hotel,
	};
}

export function hotelsToMapPois(hotels: HotelComputed[]): HotelMapPoi[] {
	return hotels.flatMap((hotel) => {
		const poi = hotelToMapPoi(hotel);
		return poi ? [poi] : [];
	});
}
