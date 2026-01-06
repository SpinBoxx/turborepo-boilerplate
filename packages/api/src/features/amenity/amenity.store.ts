import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type {
	Amenity,
	CreateAmenityInput,
	DeleteAmenityInput,
	ListAmenitiesInput,
	UpdateAmenityInput,
} from "./amenity.schemas";

const amenitySelect: Prisma.AmenitySelect = {
	id: true,
	name: true,
	icon: true,
	createdAt: true,
	updatedAt: true,
} as const;

export async function createAmenity(
	input: CreateAmenityInput,
): Promise<Amenity> {
	const created = await prisma.amenity.create({
		data: {
			name: input.name,
			icon: input.icon,
		},
		select: amenitySelect,
	});

	return created;
}

export async function getAmenityById(id: string): Promise<Amenity | null> {
	return prisma.amenity.findUnique({
		where: { id },
		select: amenitySelect,
	});
}

export async function listAmenities(
	input: ListAmenitiesInput,
): Promise<Amenity[]> {
	return prisma.amenity.findMany({
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
}

export async function updateAmenity(
	input: UpdateAmenityInput,
): Promise<Amenity | null> {
	try {
		return await prisma.amenity.update({
			where: { id: input.id },
			data: {
				name: input.name,
				icon: input.icon,
			},
			select: amenitySelect,
		});
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
		return await prisma.amenity.delete({
			where: { id: input.id },
			select: amenitySelect,
		});
	} catch (error) {
		if ((error as { code?: string } | null)?.code === "P2025") {
			return null;
		}
		throw error;
	}
}
