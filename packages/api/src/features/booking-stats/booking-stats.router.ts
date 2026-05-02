import { adminProcedure } from "../../index";
import {
	BookingStatsFiltersInputSchema,
	BookingStatsSnapshotSchema,
} from "./booking-stats.schemas";
import { getBookingStatsSnapshot } from "./booking-stats.service";

export const bookingStatsRouter = {
	getSnapshot: adminProcedure
		.route({
			method: "GET",
			path: "/booking-stats/snapshot",
			summary: "Get the admin booking statistics dashboard snapshot",
			tags: ["Booking", "Statistics"],
		})
		.input(BookingStatsFiltersInputSchema)
		.output(BookingStatsSnapshotSchema)
		.handler(async ({ input }) => {
			return await getBookingStatsSnapshot(input);
		}),
};
