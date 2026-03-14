import type {
	HotelAdminComputed,
	UpsertHotelInput,
} from "@zanadeal/api/features/hotel";

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

const mapHotelToUpsertHotelInput = (
	hotel: HotelAdminComputed,
): UpsertHotelInput => {
	return {
		...hotel,
		email: hotel.email ?? undefined,
		phoneNumber: hotel.phoneNumber ?? undefined,
		amenityIds: hotel.amenities.map((amenity) => amenity.id),
		images: [],
		bankAccount: hotel.bankAccount
			? {
					...hotel.bankAccount,
				}
			: undefined,
	};
};

export const getHotelInitValues = (
	hotel?: HotelAdminComputed,
): UpsertHotelInput => {
	return hotel
		? mapHotelToUpsertHotelInput(hotel)
		: { ...HOTEL_UPSERT_DEFAULT_VALUES };
};
