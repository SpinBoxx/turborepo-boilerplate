import { ORPCError } from "@orpc/server";
import { adminProcedure, publicProcedure } from "../../index";
import {
	CreateHotelInputSchema,
	GetHotelInputSchema,
	HotelSchema,
	ListHotelsInputSchema,
	ToggleHotelArchivedInputSchema,
	UpdateHotelInputSchema,
} from "./hotel.schemas";
import {
	createHotel as createHotelInDb,
	getHotelById,
	listHotels,
	toggleArchived,
	updateHotel,
} from "./hotel.store";

export const listHotelsRoute = publicProcedure
	.route({
		method: "GET",
		path: "/hotels",
		summary: "List hotels",
		tags: ["Hotel"],
	})
	.input(ListHotelsInputSchema)
	.output(HotelSchema.array())
	.handler(async ({ input, context }) => {
		return listHotels(input, { viewerUserId: context.session?.user?.id });
	});

export const getHotel = publicProcedure
	.route({
		method: "GET",
		path: "/hotels/{id}",
		summary: "Get a hotel by ID",
		tags: ["Hotel"],
	})
	.input(GetHotelInputSchema)
	.output(HotelSchema)
	.handler(async ({ input, context }) => {
		const hotel = await getHotelById(input.id, {
			viewerUserId: context.session?.user?.id,
		});
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}

		return hotel;
	});

export const createHotelRoute = publicProcedure
	.route({
		method: "POST",
		path: "/hotels",
		summary: "Create a new hotel",
		tags: ["Hotel"],
	})
	.input(CreateHotelInputSchema)
	.output(HotelSchema)
	.handler(async ({ input }) => {
		console.log({ input });

		return createHotelInDb(input);
	});

export const updateHotelRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/hotels/{id}",
		summary: "Update a hotel",
		tags: ["Hotel"],
	})
	.input(UpdateHotelInputSchema)
	.output(HotelSchema)
	.handler(async ({ input, context }) => {
		const hotel = await updateHotel(input, {
			viewerUserId: context.session?.user?.id,
		});
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}
		return hotel;
	});

export const toggleHotelArchivedRoute = adminProcedure
	.route({
		method: "PATCH",
		path: "/hotels/{id}/toggle-archived",
		summary: "Toggle hotel archived state",
		tags: ["Hotel"],
	})
	.input(ToggleHotelArchivedInputSchema)
	.output(HotelSchema)
	.handler(async ({ input, context }) => {
		const hotel = await toggleArchived(input, {
			viewerUserId: context.session?.user?.id,
		});
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}
		return hotel;
	});

export const hotelRouter = {
	list: listHotelsRoute,
	get: getHotel,
	create: createHotelRoute,
	updateHotel: updateHotelRoute,
	toggleArchived: toggleHotelArchivedRoute,
};
