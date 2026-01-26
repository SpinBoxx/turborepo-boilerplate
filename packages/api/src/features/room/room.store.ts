import prisma from "@zanadeal/db";

import type {
	CreateRoomInput,
	DeleteRoomInput,
	ListRoomsInput,
	Room,
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
		},
	});
};

export const createRoom = async (input: CreateRoomInput): Promise<Room> => {
	return await prisma.room.create({
		data: {
			...input,
			images: {
				createMany: {
					data: input.images,
				},
			},
			amenities: {
				connect: input.amenityIds.map((id) => ({ id })),
			},
			prices: {
				createMany: {
					data: input.prices,
				},
			},
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
