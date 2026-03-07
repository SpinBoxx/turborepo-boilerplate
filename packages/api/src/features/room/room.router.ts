import { ORPCError } from "@orpc/server";
import z from "zod";
import { adminProcedure, publicProcedure } from "../../index";
import { computeRoom } from "./computes/room-compute";
import { computeUpsertRoomInput } from "./computes/upsert-compute";
import {
	createRoom,
	deleteRoom,
	getRoomById,
	listRooms,
	updateRoom,
} from "./room.store";
import {
	DeleteRoomInputSchema,
	GetRoomInputSchema,
	ListRoomsInputSchema,
	RoomComputedSchema,
	UpsertRoomInputSchema,
} from "./schemas/room.schemas";

export const listRoomRoute = publicProcedure
	.route({
		method: "GET",
		path: "/rooms",
		summary: "List rooms",
		tags: ["Room"],
	})
	.input(ListRoomsInputSchema)
	.output(RoomComputedSchema.array())
	.handler(async ({ input, context }) => {
		const rooms = await listRooms(input);
		return await Promise.all(
			rooms.map(async (r) => await computeRoom(r, context.user)),
		);
	});

export const getRoomRoute = publicProcedure
	.route({
		method: "GET",
		path: "/rooms/{id}",
		summary: "Get a room by ID",
		tags: ["Room"],
	})
	.input(GetRoomInputSchema)
	.output(RoomComputedSchema)
	.handler(async ({ input, context }) => {
		const room = await getRoomById(input.id);
		if (!room) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeRoom(room, context.user);
	});

export const createRoomRoute = adminProcedure
	.route({
		method: "POST",
		path: "/rooms",
		summary: "Create a new room",
		tags: ["Room"],
	})
	.input(UpsertRoomInputSchema)
	.output(RoomComputedSchema)
	.handler(async ({ input, context }) => {
		const computedInput = await computeUpsertRoomInput(input);
		const created = await createRoom(computedInput);
		return await computeRoom(created, context.user);
	});

export const updateRoomRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/rooms/{id}",
		summary: "Update a room",
		tags: ["Room"],
	})
	.input(z.intersection(GetRoomInputSchema, UpsertRoomInputSchema.partial()))
	.output(RoomComputedSchema)
	.handler(async ({ input, context }) => {
		const computedInput = await computeUpsertRoomInput(input);
		const updated = await updateRoom(input.id, computedInput);
		if (!updated) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeRoom(updated, context.user);
	});

export const deleteRoomRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/rooms/{id}",
		summary: "Delete room",
		tags: ["Room"],
	})
	.input(DeleteRoomInputSchema)
	.output(RoomComputedSchema)
	.handler(async ({ input, context }) => {
		const deleted = await deleteRoom(input);
		if (!deleted) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeRoom(deleted, context.user);
	});

export const roomRouter = {
	list: listRoomRoute,
	get: getRoomRoute,
	create: createRoomRoute,
	update: updateRoomRoute,
	delete: deleteRoomRoute,
};
