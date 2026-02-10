import prisma from "@zanadeal/db";

import type {
	DeleteRoomInput,
	ListRoomsInput,
	Room,
	UpsertRoomComputedInput,
} from "./room.schemas";

export const listRooms = async (input: ListRoomsInput): Promise<Room[]> => {
	return await prisma.room.findMany({
		where: {
			prices: {
				every: {
					startDate: input.where.startDate,
					endDate: input.where.endDate,
				},
			},
			hotelId: input.where.hotelId,
			hotel: {
				name: {
					contains: input.where.hotelName,
				},
			},
			type: input.where.type,
		},
		include: {
			images: true,
			amenities: true,
			prices: {
				orderBy: {
					price: input.orderBy?.price,
				},
			},
			hotel: true,
		},
	});
};

export const createRoom = async (
	input: UpsertRoomComputedInput,
): Promise<Room> => {
	const { images, amenityIds, prices, ...roomData } = input;

	return await prisma.room.create({
		data: {
			...roomData,
			images: images.length
				? {
						create: images.map((img) => ({
							url: img.url ?? "",
							publicId: img.publicId ?? "",
						})),
					}
				: undefined,
			amenities: {
				connect: amenityIds.map((id) => ({ id })),
			},
			prices: prices.length
				? {
						createMany: {
							data: prices,
						},
					}
				: undefined,
		},
		include: {
			images: true,
			amenities: true,
			prices: true,
		},
	});
};

export const updateRoom = async (
	roomId: string,
	input: Partial<UpsertRoomComputedInput>,
): Promise<Room> => {
	const { images, amenityIds, prices, ...roomData } = input;
	console.log({ amenityIds });

	return await prisma.room.update({
		where: {
			id: roomId,
		},
		data: {
			...roomData,
			images: images?.length
				? {
						deleteMany: {}, // Supprime les images existantes
						create: images.map((img) => ({
							url: img.url ?? "",
							publicId: img.publicId ?? "",
						})),
					}
				: undefined,
			amenities: amenityIds
				? {
						set: amenityIds.map((id) => ({ id })),
					}
				: undefined,
			prices: prices?.length
				? {
						deleteMany: {}, // Supprime les prix existants
						createMany: {
							data: prices,
						},
					}
				: undefined,
		},
		include: {
			images: true,
			amenities: true,
			prices: true,
		},
	});
};

export const deleteRoom = async (input: DeleteRoomInput): Promise<Room> => {
	return await prisma.room.delete({
		where: {
			id: input.id,
		},
		include: {
			images: true,
			amenities: true,
			prices: true,
		},
	});
};
