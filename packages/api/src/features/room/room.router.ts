import z from "zod";
import { adminProcedure, publicProcedure } from "../..";
import { computeUpsertRoomInput } from "./computes/upsert-compute";
import {
	DeleteRoomInputSchema,
	GetRoomInputSchema,
	ListRoomsInputSchema,
	RoomSchema,
	UpsertRoomInputSchema,
} from "./room.schemas";

import { createRoom, deleteRoom, listRooms, updateRoom } from "./room.store";

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

export const updateRoomRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/rooms/{id}",
		summary: "Update a room",
		tags: ["Room"],
	})
	.input(z.intersection(UpsertRoomInputSchema.partial(), GetRoomInputSchema))
	.output(RoomSchema)
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertRoomInput(input);
		return updateRoom(input.id, computedInput);
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
	update: updateRoomRoute,
	delete: deleteRoomRoute,
};
