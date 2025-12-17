import { ORPCError } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "../../index";
import {
	CreateHotelInputSchema,
	GetHotelInputSchema,
	HotelSchema,
} from "./hotel.schemas";
import { createHotelInStore, getHotelById } from "./hotel.store";

export const getHotel = publicProcedure
	.route({ method: "GET", path: "/hotels/{id}" })
	.input(GetHotelInputSchema)
	.output(HotelSchema)

	.handler(({ input }) => {
		const hotel = getHotelById(input.id);
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}
		return hotel;
	});

export const createHotel = protectedProcedure
	.route({ method: "POST", path: "/hotels" })
	.input(CreateHotelInputSchema)
	.output(HotelSchema)
	.handler(({ input }) => {
		return createHotelInStore(input);
	});

export const hotelRouter = {
	get: getHotel,
	create: createHotel,
};
