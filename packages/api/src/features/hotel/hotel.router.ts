import { ORPCError } from "@orpc/server";
import { createMail } from "@zanadeal/mailer";
import { protectedProcedure, publicProcedure } from "../../index";
import {
	CreateHotelInputSchema,
	GetHotelInputSchema,
	HotelSchema,
} from "./hotel.schemas";
import { createHotelInStore, getHotelById } from "./hotel.store";

export const getHotel = publicProcedure
	.route({
		method: "GET",
		path: "/hotels/{id}",
		summary: "Get a hotel by ID",
		tags: ["Hotel"],
	})
	.input(GetHotelInputSchema)
	.output(HotelSchema)
	.handler(async ({ input }) => {
		const hotel = getHotelById(Number(input.id));
		if (!hotel) {
			throw new ORPCError("NOT_FOUND");
		}
		await createMail();
		return hotel;
	});

export const createHotel = protectedProcedure
	.route({
		method: "POST",
		path: "/hotels",
		summary: "Create a new hotel",
		tags: ["Hotel"],
	})
	.input(CreateHotelInputSchema)
	.output(HotelSchema)
	.handler(({ input }) => {
		return createHotelInStore(input);
	});

export const testMail = publicProcedure
	.route({
		method: "GET",
		path: "/hotels/test-mail/send",
		summary: "Create a new hotelrr",
		tags: ["Hotel"],
	})
	.handler(async () => {
		const templates = await createMail();
		console.log(templates);
	});

export const hotelRouter = {
	get: getHotel,
	mail: testMail,
	create: createHotel,
};
