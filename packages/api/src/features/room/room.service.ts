import { computeAmenity } from "../amenity/computes/amenity-compute";
import { fromStoredMoneyAmount } from "../../money";
import type { UserComputed } from "../user";
import type { RoomDB } from "./room.store";
import type { RoomComputed } from "./schemas/room.schemas";

export interface RoomComputeOptions {
	checkInDate?: Date;
	checkOutDate?: Date;
	availabilityByRoomId?: Map<string, number>;
}

export const computeCurrentPrice = (room: RoomDB) => {
	const now = new Date();
	const validPrices = room.prices.filter((price) => {
		const isAfterStart = price.startDate <= now;
		const isBeforeEnd = !price.endDate || price.endDate >= now;
		return isAfterStart && isBeforeEnd;
	});

	validPrices.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

	return validPrices.at(0);
};

export const normalizeRoomPrice = (
	price: RoomDB["prices"][number],
): RoomComputed["prices"][number] => {
	return {
		...price,
		price: fromStoredMoneyAmount(price.price),
		promoPrice: fromStoredMoneyAmount(price.promoPrice),
	};
};

export const computeRoomPriceFields = (room: RoomDB) => {
	const currentPrice = computeCurrentPrice(room);
	return {
		price: currentPrice ? fromStoredMoneyAmount(currentPrice.price ?? 0) : 0,
		promoPrice: currentPrice
			? fromStoredMoneyAmount(currentPrice.promoPrice ?? 0)
			: 0,
	};
};

export const computeRoomAmenities = async (
	room: RoomDB,
	user: UserComputed | null | undefined,
): Promise<RoomComputed["amenities"]> => {
	return await Promise.all(
		room.amenities.map(async (amenity) => await computeAmenity(amenity, user)),
	);
};

export const computeAvailableCapacity = (
	room: Pick<RoomDB, "id" | "quantity">,
	options?: RoomComputeOptions,
) => {
	if (!options?.checkInDate || !options?.checkOutDate) {
		return room.quantity;
	}

	const reservedQuantity = options.availabilityByRoomId?.get(room.id) ?? 0;
	return Math.max(room.quantity - reservedQuantity, 0);
};

/** General compute — builds the full room object with all computed fields */
export const computeRoomFull = async (
	room: RoomDB,
	user: UserComputed | null | undefined,
 	options?: RoomComputeOptions,
): Promise<
	RoomDB & {
		price: number;
		promoPrice: number;
		availableCapacity: number;
		amenities: RoomComputed["amenities"];
	}
> => {
	return {
		...room,
		prices: room.prices.map(normalizeRoomPrice),
		...computeRoomPriceFields(room),
		availableCapacity: computeAvailableCapacity(room, options),
		amenities: await computeRoomAmenities(room, user),
	};
};
