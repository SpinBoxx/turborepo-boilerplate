import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure } from "../../index";
import { createPaginatedResultSchema } from "../../listing/paginated-result";
import { computeHotel } from "./computes/hotel-compute";
import { computeUpsertHotelInput } from "./computes/upsert-compute";
import { createHotel, deleteHotel, getHotel, updateHotel } from "./hotel.store";
import { listHotels } from "./hotel-list.service";
import {
	DeleteHotelInputSchema,
	GetHotelInputSchema,
	HotelComputedSchema,
	ListHotelsInputSchema,
	UpsertHotelInputSchema,
} from "./schemas/hotel.schema";

export const listHotelsRoute = publicProcedure
	.route({
		method: "GET",
		path: "/hotels",
		summary: "List hotels",
		tags: ["Hotel"],
	})
	.input(ListHotelsInputSchema)
	.output(createPaginatedResultSchema(HotelComputedSchema))
	.handler(async ({ input, context }) => {
		return await listHotels(input, context.user);
	});

export const getHotelRoute = publicProcedure
	.route({
		method: "GET",
		path: "/hotels/{id}",
		summary: "Get a hotel by ID",
		tags: ["Hotel"],
	})
	.input(GetHotelInputSchema)
	.output(HotelComputedSchema)
	.handler(async ({ input, context }) => {
		const hotel = await getHotel(input.id);
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeHotel(hotel, context.user);
	});

export const createHotelRoute = adminProcedure
	.route({
		method: "POST",
		path: "/hotels",
		summary: "Create a new hotel",
		tags: ["Hotel"],
	})
	.input(UpsertHotelInputSchema)
	.output(HotelComputedSchema)
	.handler(async ({ input, context }) => {
		const computedInput = await computeUpsertHotelInput(input);
		const created = await createHotel(computedInput);
		return await computeHotel(created, context.user);
	});

export const updateHotelRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/hotels/{id}",
		summary: "Update a hotel",
		tags: ["Hotel"],
	})
	.input(z.intersection(GetHotelInputSchema, UpsertHotelInputSchema.partial()))
	.output(HotelComputedSchema)
	.handler(async ({ input, context }) => {
		const existing = await getHotel(input.id);
		if (!existing) {
			throw new ORPCError("NOT_FOUND");
		}

		const computedInput = await computeUpsertHotelInput(input);
		const updated = await updateHotel(input.id, computedInput);
		return await computeHotel(updated, context.user);
	});

export const deleteHotelRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/hotels/{id}",
		summary: "Delete a hotel",
		tags: ["Hotel"],
	})
	.input(DeleteHotelInputSchema)
	.output(HotelComputedSchema)
	.handler(async ({ input, context }) => {
		const deleted = await deleteHotel(input);
		if (!deleted) {
			throw new ORPCError("NOT_FOUND");
		}
		return await computeHotel(deleted, context.user);
	});

export const hotelRouter = {
	list: listHotelsRoute,
	get: getHotelRoute,
	create: createHotelRoute,
	update: updateHotelRoute,
	delete: deleteHotelRoute,
};
