import type {
	Hotel,
	UpsertHotelInput,
} from "@zanadeal/api/features/hotel/schemas/hotel.schema";

export const HOTEL_UPSERT_DEFAULT_VALUES: UpsertHotelInput = {
	amenityIds: [],
	address: "",
	description: "",
	images: [],
	name: "",
	latitude: "",
	longitude: "",
	mapLink: "",
	isArchived: false,
};

const mapHotelToUpsertHotelInput = (hotel: Hotel): UpsertHotelInput => {
	return {
		...hotel,
		amenityIds: hotel.amenities.map((amenity) => amenity.id),
		images: [],
		bankAccount: hotel.bankAccount
			? {
					...hotel.bankAccount,
				}
			: undefined,
	};
};

export const getHotelInitValues = (hotel?: Hotel): UpsertHotelInput => {
	return hotel
		? mapHotelToUpsertHotelInput(hotel)
		: { ...HOTEL_UPSERT_DEFAULT_VALUES };
};
