import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type {
	DeleteAmenityInput,
	ListAmenitiesInput,
	UpsertAmenityComputedInput,
} from "./schemas/amenity.schemas";

const amenityInclude = {} satisfies Prisma.AmenityInclude;
export type AmenityDB = Prisma.AmenityGetPayload<{
	include: typeof amenityInclude;
}>;

export async function getAmenityById(id: string): Promise<AmenityDB | null> {
	return await prisma.amenity.findUnique({
		where: { id },
		include: amenityInclude,
	});
}

export async function listAmenities(
	input: ListAmenitiesInput,
): Promise<AmenityDB[]> {
	const amenities = await prisma.amenity.findMany({
		orderBy: { [input.sort.field]: input.sort.direction },
		take: input.take,
		skip: input.skip,
		where: {
			...input.filters,
		},
		include: amenityInclude,
	});

	return amenities;
}

export async function createAmenity(
	input: UpsertAmenityComputedInput,
): Promise<AmenityDB> {
	return await prisma.amenity.create({
		data: input,
	});
}

export async function updateAmenity(
	id: string,
	input: Partial<UpsertAmenityComputedInput>,
): Promise<AmenityDB | null> {
	return await prisma.amenity.update({
		where: { id },
		data: input,
	});
}

export async function deleteAmenity(
	input: DeleteAmenityInput,
): Promise<AmenityDB | null> {
	return await prisma.amenity.delete({
		where: { id: input.id },
	});
}
