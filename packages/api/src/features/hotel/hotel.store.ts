import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";
import type {
	DeleteHotelInput,
	Hotel,
	ListHotelsInput,
	UpsertHotelComputedInput,
} from "./schemas/hotel.schema";

const hotelAdminIncludeBase = {
	amenities: true,
	images: true,
	reviews: true,
	contacts: true,
	rooms: {
		include: {
			images: true,
			amenities: true,
			prices: true,
		},
	},
	bankAccount: true,
} satisfies Prisma.HotelInclude;

const hotelUserIncludeBase = {
	amenities: true,
	images: true,
	contacts: true,
	rooms: {
		include: {
			images: true,
			amenities: true,
			prices: true,
		},
	},
} satisfies Prisma.HotelInclude;

export async function createHotel(input: UpsertHotelComputedInput) {
	const { amenityIds, bankAccount, images, ...hotelData } = input;
	const hotel = await prisma.hotel.create({
		data: {
			...hotelData,
			amenities: {
				connect: amenityIds?.map((id) => ({ id })),
			},
			bankAccount: bankAccount
				? {
						create: { ...bankAccount },
					}
				: undefined,
			images: {
				create: images?.map((img) => ({
					url: img.url,
					publicId: img.publicId,
				})),
			},
		},
	});

	return hotel;
}

export async function getHotelAdmin(id: string) {
	return await prisma.hotel.findUnique({
		where: { id },
		include: hotelAdminIncludeBase,
	});
}

export async function getHotel(id: string): Promise<Hotel | null> {
	return await prisma.hotel.findUnique({
		where: { id },
		include: hotelUserIncludeBase,
	});
}

export async function updateHotel(
	id: string,
	input: Partial<UpsertHotelComputedInput>,
) {
	const { amenityIds, bankAccount, images, ...hotelData } = input;

	const hotel = await prisma.hotel.update({
		where: { id },
		data: {
			...hotelData,
			amenities: {
				set: amenityIds?.map((id) => ({ id })),
			},
			bankAccount: bankAccount
				? {
						upsert: {
							create: { ...bankAccount },
							update: { ...bankAccount },
						},
					}
				: undefined,
			images: images
				? {
						deleteMany: {}, // Supprime toutes les images existantes
						create: images?.map((img) => ({
							url: img.url,
							publicId: img.publicId,
						})),
					}
				: undefined,
		},
	});

	return hotel;
}

export async function listHotelsAdmin(input: ListHotelsInput) {
	return await prisma.hotel.findMany({
		where: {
			name: input.where?.name
				? { contains: input.where.name, mode: "insensitive" }
				: undefined,
			id: input.where?.id ? input.where.id : undefined,
		},
		orderBy: {
			name: input.orderBy?.name,
			createdAt: input.orderBy?.createdAt,
		},
		take: input.take ?? 50,
		include: hotelAdminIncludeBase,
	});
}

export async function deleteHotel(input: DeleteHotelInput) {
	const deleted = await prisma.hotel.delete({
		where: { id: input.id },
	});

	return deleted;
}
