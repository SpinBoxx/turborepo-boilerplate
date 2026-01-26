import prisma from "@zanadeal/db";
import type { ListRoomsInput, Room } from "./room.schemas";

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
