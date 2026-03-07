import type { AmenityDB } from "../../amenity.store";
import type { AmenityComputed } from "../../schemas/amenity.schemas";

export const amenityAdminCompute = async (
	amenity: AmenityDB,
): Promise<AmenityComputed> => {
	return {
		...amenity,
		translations: amenity.translations as AmenityComputed["translations"],
	};
};
