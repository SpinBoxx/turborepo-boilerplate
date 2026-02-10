import type { Room, RoomComputed } from "../room.schemas";

const computeRoomPrices = (room: Room): RoomComputed["prices"] => {
	const now = new Date();
	const validPrices = room.prices.filter((price) => {
		const isAfterStart = price.startDate <= now;
		const isBeforeEnd = !price.endDate || price.endDate >= now;
		return isAfterStart && isBeforeEnd;
	});

	// Sort by price ascending
	validPrices.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

	return validPrices;
};

export const computeRoom = async (room: Room): Promise<RoomComputed> => {
	const currentPrices = computeRoomPrices(room).at(0);

	return {
		...room,
		price: currentPrices ? (currentPrices.price ?? 0) : 0,
		promoPrice: currentPrices ? (currentPrices.promoPrice ?? 0) : 0,
	};
};
