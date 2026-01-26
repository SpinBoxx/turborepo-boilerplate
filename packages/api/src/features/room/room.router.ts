import { adminProcedure, publicProcedure } from "../..";
import {
	CreateRoomInputSchema,
	DeleteRoomInputSchema,
	ListRoomsInputSchema,
	RoomSchema,
} from "./room.schemas";
import { createRoom, deleteRoom, listRooms } from "./room.store";

export const createRoomRoute = adminProcedure
	.route({
		method: "POST",
		path: "/rooms",
		summary: "Create a new room",
		tags: ["Room"],
	})
	.input(CreateRoomInputSchema)
	.output(RoomSchema)
	.handler(async ({ input }) => {
		return createRoom(input);
	});

export const listRoomRoute = publicProcedure
	.route({
		method: "GET",
		path: "/rooms",
		summary: "List rooms",
		tags: ["Room"],
	})
	.input(ListRoomsInputSchema)
	.output(RoomSchema.array())
	.handler(async ({ input }) => {
		return listRooms(input);
	});

export const deleteRoomRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/rooms",
		summary: "Delete room",
		tags: ["Room"],
	})
	.input(DeleteRoomInputSchema)
	.output(RoomSchema)
	.handler(async ({ input }) => {
		return deleteRoom(input);
	});

export const roomRouter = {
	list: listRoomRoute,
	create: createRoomRoute,
	delete: deleteRoomRoute,
};
