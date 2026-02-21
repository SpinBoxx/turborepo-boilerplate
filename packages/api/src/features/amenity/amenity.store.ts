import prisma from "@zanadeal/db";
import type { Amenity, Prisma } from "../../../../db/prisma/generated/client";
import type {
	DeleteAmenityInput,
	ListAmenitiesInput,
	UpsertAmenityComputedInput,
} from "./amenity.schemas";

const amenitySelect: Prisma.AmenitySelect = {
	id: true,
	slug: true,
	icon: true,
	translations: true,
	createdAt: true,
	updatedAt: true,
} as const;

export async function createAmenity(
	input: UpsertAmenityComputedInput,
): Promise<Amenity> {
	const { translations, ...amenityData } = input;

	const created = await prisma.amenity.create({
		data: {
			...amenityData,
			translations: translations as Prisma.InputJsonValue,
		},
		select: amenitySelect,
	});

	return created;
}

export async function getAmenityById(id: string): Promise<Amenity | null> {
	const amenity = await prisma.amenity.findUnique({
		where: { id },
		select: amenitySelect,
	});

	if (!amenity) {
		return null;
	}

	return amenity;
}

export async function listAmenities(
	input: ListAmenitiesInput,
): Promise<Amenity[]> {
	const amenities = await prisma.amenity.findMany({
		orderBy: { createdAt: "desc" },
		...(input.cursor
			? {
					cursor: { id: input.cursor },
					skip: 1,
				}
			: {}),
		take: input.take ?? 50,
		select: amenitySelect,
	});

	return amenities;
}

export async function updateAmenity(
	id: string,
	input: Partial<UpsertAmenityComputedInput>,
): Promise<Amenity | null> {
	const { translations, ...amenityData } = input;

	try {
		const updatedAmenity = await prisma.amenity.update({
			where: { id },
			data: {
				...amenityData,
				translations:
					translations === undefined
						? undefined
						: (translations as Prisma.InputJsonValue),
			},
			select: amenitySelect,
		});

		return updatedAmenity;
	} catch (error) {
		if ((error as { code?: string } | null)?.code === "P2025") {
			return null;
		}
		throw error;
	}
}

export async function deleteAmenity(
	input: DeleteAmenityInput,
): Promise<Amenity | null> {
	try {
		const deletedAmenity = await prisma.amenity.delete({
			where: { id: input.id },
			select: amenitySelect,
		});

		return deletedAmenity;
	} catch (error) {
		if ((error as { code?: string } | null)?.code === "P2025") {
			return null;
		}
		throw error;
	}
}
