import { getHotel, type HotelDb } from "../hotel.store";

export const getHotelComputed = async (
	_hotel: HotelDb,
): Promise<HotelDb | null> => {
	return await getHotel(id);
};
