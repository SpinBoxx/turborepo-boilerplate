import prisma from "@zanadeal/db";

import type { Prisma } from "../../../../db/prisma/generated/client";
import type {
	DeleteRoomInput,
	ListRoomsInput,
	UpsertRoomComputedInput,
} from "./schemas/room.schemas";

const roomInclude = {
	images: true,
	amenities: true,
	prices: true,
} satisfies Prisma.RoomInclude;

export type RoomDB = Prisma.RoomGetPayload<{
	include: typeof roomInclude;
}>;

export async function getRoomById(id: string): Promise<RoomDB | null> {
	return await prisma.room.findUnique({
		where: { id },
		include: roomInclude,
	});
}

export async function listRooms(input: ListRoomsInput): Promise<RoomDB[]> {
	return await prisma.room.findMany({
		orderBy: { [input.sort.field]: input.sort.direction },
		take: input.take,
		skip: input.skip,
		where: {
			type: input.filters.type?.equal,
		},
		include: roomInclude,
	});
}

export const createRoom = async (
	input: UpsertRoomComputedInput,
): Promise<RoomDB> => {
	const { images, amenityIds, prices, ...roomData } = input;

	return await prisma.room.create({
		data: {
			...roomData,
			images: images.length
				? {
						create: images.map((img) => ({
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
		include: roomInclude,
	});
};

export const updateRoom = async (
	roomId: string,
	input: Partial<UpsertRoomComputedInput>,
): Promise<RoomDB> => {
	const { images, amenityIds, prices, ...roomData } = input;

	return await prisma.room.update({
		where: {
			id: roomId,
		},
		data: {
			...roomData,
			images: images?.length
				? {
						deleteMany: {},
						create: images.map((img) => ({
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
						deleteMany: {},
						createMany: {
							data: prices,
						},
					}
				: undefined,
		},
		include: roomInclude,
	});
};

export const deleteRoom = async (input: DeleteRoomInput): Promise<RoomDB> => {
	return await prisma.room.delete({
		where: {
			id: input.id,
		},
		include: roomInclude,
	});
};
