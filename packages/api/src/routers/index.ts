import type { RouterClient } from "@orpc/server";
import { amenityRouter } from "../features/amenity/amenity.router";
import { hotelRouter } from "../features/hotel/hotel.router";
import { roomRouter } from "../features/room/room.router";
import { termsRouter } from "../features/terms/terms.router";
import { protectedProcedure, publicProcedure } from "../index";

export const appRouter = {
	healthCheck: publicProcedure
		.route({
			method: "GET",
			path: "/health",
			summary: "Health check",
			tags: ["General"],
		})
		.handler(() => {
			return { status: "ok" };
		}),
	loadSession: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			session: context.session,
		};
	}),
	hotel: hotelRouter,
	amenity: amenityRouter,
	terms: termsRouter,
	room: roomRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
