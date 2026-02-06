import type { Hotel, HotelComputed } from "../schemas/hotel.schema";

const computeRating = (hotel: Hotel): number => {
	// Placeholder logic for computing rating based on reviews.
	if (!hotel.reviews || hotel.reviews.length === 0) {
		return 0;
	}
	const totalRating = hotel.reviews.reduce(
		(sum, review) => sum + review.rating,
		0,
	);
	return totalRating / hotel.reviews.length;
};

const computeStartingPrice = (hotel: Hotel): number => {
	// Placeholder logic for computing starting price based on rooms.
	if (!hotel.rooms || hotel.rooms.length === 0) {
		return 0;
	}
	return Math.min(
		...hotel.rooms.flatMap((room) => room.prices.map((price) => price.price)),
	);
};

export const computeHotel = async (hotels: Hotel): Promise<HotelComputed> => {
	const computedRating = computeRating(hotels);
	const computedStartingPrice = computeStartingPrice(hotels);

	return {
		...hotels,
		rating: computedRating,
		isUserFavorite: false, // Placeholder, should be computed based on user's favorites
		startingPrice: computedStartingPrice,
	};
};
