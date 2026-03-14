import prisma from "../src/index";
import { amenitySeeds } from "./amenities.data";

export async function seedAmenities() {
	for (const amenity of amenitySeeds) {
		await prisma.amenity.upsert({
			where: { slug: amenity.slug },
			update: {
				icon: amenity.icon,
				translations: amenity.translations,
			},
			create: amenity,
		});
	}

	return amenitySeeds.length;
}
