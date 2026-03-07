import { computeAmenity } from "../../amenity/computes/amenity-compute";
import { computeRoom } from "../../room/computes/room-compute";
import type { UserComputed } from "../../user";
import type { HotelDB } from "../hotel.store";
import type { HotelComputed } from "../schemas/hotel.schema";

export const computeHotelRating = (hotel: HotelDB): number => {
	if (!hotel.reviews || hotel.reviews.length === 0) {
		return 0;
	}
	const totalRating = hotel.reviews.reduce(
		(sum, review) => sum + review.rating,
		0,
	);
	return totalRating / hotel.reviews.length;
};

export const computeHotelStartingPrice = (hotel: HotelDB): number => {
	if (!hotel.rooms || hotel.rooms.length === 0) {
		return 0;
	}
	const allPrices = hotel.rooms.flatMap((room) =>
		room.prices.map((price) => price.price),
	);
	if (allPrices.length === 0) {
		return 0;
	}
	return Math.min(...allPrices);
};

export const computeHotelAmenities = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
): Promise<HotelComputed["amenities"]> => {
	return await Promise.all(
		hotel.amenities.map(async (amenity) => await computeAmenity(amenity, user)),
	);
};

export const computeHotelRooms = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
): Promise<HotelComputed["rooms"]> => {
	return await Promise.all(
		hotel.rooms.map(async (room) => await computeRoom(room, user)),
	);
};

/** General compute — builds the full hotel object with all computed fields */
export const computeHotelFull = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
) => {
	return {
		...hotel,
		rating: computeHotelRating(hotel),
		startingPrice: computeHotelStartingPrice(hotel),
		amenities: await computeHotelAmenities(hotel, user),
		rooms: await computeHotelRooms(hotel, user),
	};
};
