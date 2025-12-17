import type { Hotel } from "./hotel.schemas";

let nextId = 1;
const hotelsById = new Map<number, Hotel>();

export function resetHotelStore() {
	nextId = 1;
	hotelsById.clear();
}

export function createHotelInStore(input: Omit<Hotel, "id">): Hotel {
	const hotel: Hotel = {
		id: nextId,
		...input,
	};

	nextId += 1;
	hotelsById.set(hotel.id, hotel);
	return hotel;
}

export function getHotelById(id: number): Hotel | undefined {
	return hotelsById.get(id);
}
