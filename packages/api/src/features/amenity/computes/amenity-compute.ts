import type { Amenity as DbAmenity } from "../../../../../db/prisma/generated/client";
import type { Amenity } from "../amenity.schemas";

export const computeAmenity = (amenity: DbAmenity): Amenity => {
	return {
		id: amenity.id,
		slug: amenity.slug,
		icon: amenity.icon,
		translations: amenity.translations as Amenity["translations"],
		createdAt: amenity.createdAt,
		updatedAt: amenity.updatedAt,
	};
};
