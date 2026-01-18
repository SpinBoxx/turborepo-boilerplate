import type { CreateHotelInput, Hotel } from "@zanadeal/api/contracts";

export const HOTEL_UPSERT_DEFAULT_VALUES: CreateHotelInput = {
	name: "",
	description: "",
	address: "",
	mapLink: "",
	latitude: "",
	longitude: "",
	amenityIds: [],
	// Keep the optional fields unset by default in this minimal scaffold.
	// bankAccount: undefined,
	// images: undefined,
	// isArchived: undefined,
};

export function getHotelUpsertDefaultValues(hotel?: Hotel): CreateHotelInput {
	if (!hotel) return HOTEL_UPSERT_DEFAULT_VALUES;

	return {
		...HOTEL_UPSERT_DEFAULT_VALUES,
		name: hotel.name ?? "",
		description: hotel.description ?? "",
		address: hotel.address ?? "",
		mapLink: hotel.mapLink ?? "",
		latitude: hotel.latitude ?? "",
		longitude: hotel.longitude ?? "",
		amenityIds: hotel.amenities?.map((a) => a.id) ?? [],
		bankAccount: hotel.bankAccount
			? {
					iban: hotel.bankAccount.iban,
					bic: hotel.bankAccount.bic,
					bankName: hotel.bankAccount.bankName,
					accountHolderName: hotel.bankAccount.accountHolderName,
				}
			: undefined,
		images:
			hotel.images?.map((img) => ({ url: img.url, publicId: img.publicId })) ??
			undefined,
	};
}
