import type { RouterClient } from "@orpc/server";
import { amenityRouter } from "../features/amenity/amenity.router";
import { contactRouter } from "../features/contact/contact.router";
import { hotelRouter } from "../features/hotel/hotel.router";
import { roomRouter } from "../features/room/room.router";
import { termsRouter } from "../features/terms/terms.router";
import { protectedProcedure, publicProcedure } from "../index";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	hotel: hotelRouter,
	amenity: amenityRouter,
	contact: contactRouter,
	terms: termsRouter,
	room: roomRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
