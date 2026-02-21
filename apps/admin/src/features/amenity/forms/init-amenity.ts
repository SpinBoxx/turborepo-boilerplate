import type {
	Amenity,
	UpsertAmenityInput,
} from "@zanadeal/api/features/amenity/amenity.schemas";

export const getAmenityInitialValues = (
	amenity: Amenity | null,
): UpsertAmenityInput => {
	return {
		slug: amenity?.slug ?? "",
		translations: Object.entries(amenity?.translations ?? {}).map(
			([locale, value]) => ({
				locale: locale as UpsertAmenityInput["translations"][number]["locale"],
				...value,
			}),
		),
		icon: amenity?.icon ?? "",
	};
};
