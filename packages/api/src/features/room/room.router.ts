import { adminProcedure, publicProcedure } from "../..";
import { computeUpsertRoomInput } from "./computes/upsert-compute";
import {
	DeleteRoomInputSchema,
	ListRoomsInputSchema,
	RoomSchema,
	UpsertRoomInputSchema,
} from "./room.schemas";

import { createRoom, deleteRoom, listRooms } from "./room.store";

export const createRoomRoute = adminProcedure
	.route({
		method: "POST",
		path: "/rooms",
		summary: "Create a new room",
		tags: ["Room"],
	})
	.input(UpsertRoomInputSchema)
	.output(RoomSchema)
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertRoomInput(input);

		return createRoom(computedInput);
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
