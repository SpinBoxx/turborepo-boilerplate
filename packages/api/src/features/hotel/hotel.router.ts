import { ORPCError } from "@orpc/server";
import { z } from "zod";
import type { User } from "../../../../db/prisma/generated/client";
import { adminProcedure, publicProcedure } from "../../index";
import { computeHotel } from "./computes/hotel-compute";
import { computeUpsertHotelInput } from "./computes/upsert-compute";
import { getHotelByRole } from "./hotel.service";
import {
	createHotel,
	deleteHotel,
	listHotelsAdmin,
	updateHotel,
} from "./hotel.store";
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
	.handler(async ({ input }) => {
		const hotels = await listHotelsAdmin(input);
		const computedHotels = await Promise.all(hotels.map(computeHotel));
		console.log(computedHotels);

		return computedHotels;
	});

export const getHotel = publicProcedure
	.route({
		method: "GET",
		path: "/hotels/{id}",
		summary: "Get a hotel by ID",
		tags: ["Hotel"],
		inputStructure: "detailed",
	})
	.input(GetHotelInputSchema)
	.output(HotelComputedSchema)
	.handler(async ({ input, context }) => {
		const hotel = await getHotelByRole(
			input.id,
			context.session?.user as User | undefined,
		);
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}

		const computedHotel = await computeHotel(hotel);

		return computedHotel;
	});

export const createHotelRoute = publicProcedure
	.route({
		method: "POST",
		path: "/hotels",
		summary: "Create a new hotel",
		tags: ["Hotel"],
	})
	.input(UpsertHotelInputSchema)
	.handler(async ({ input }) => {
		const computedInput = await computeUpsertHotelInput(input);
		return createHotel(computedInput);
	});

export const updateHotelRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/hotels/{id}",
		summary: "Update a hotel",
		tags: ["Hotel"],
	})
	.input(z.intersection(GetHotelInputSchema, UpsertHotelInputSchema.partial()))
	.handler(async ({ input, context }) => {
		const hotel = await getHotelByRole(
			input.id,
			context.session?.user as User | undefined,
		);
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}

		const computedInput = await computeUpsertHotelInput(input);

		const updatedHotel = await updateHotel(input.id, computedInput);

		return updatedHotel;
	});

export const deleteHotelRoute = adminProcedure
	.route({
		method: "DELETE",
		path: "/hotels/{id}",
		summary: "Delete a hotel",
		tags: ["Hotel"],
	})
	.input(DeleteHotelInputSchema)
	.handler(async ({ input, context }) => {
		const hotel = await deleteHotel(input);
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}
		return hotel;
	});

export const hotelRouter = {
	list: listHotelsRoute,
	get: getHotel,
	create: createHotelRoute,
	update: updateHotelRoute,
	delete: deleteHotelRoute,
};
