import { ORPCError } from "@orpc/server";
import { publicProcedure } from "../../index";
import {
	BookingQuoteComputedSchema,
	CancelBookingQuoteInputSchema,
	CreateBookingQuoteInputSchema,
	GetBookingQuoteInputSchema,
} from "./booking-quote.schemas";
import {
	computeBookingQuote,
	createBookingQuote,
} from "./booking-quote.service";
import {
	getBookingQuote,
	updateBookingQuoteStatus,
} from "./booking-quote.store";

export const createBookingQuoteRoute = publicProcedure
	.route({
		method: "POST",
		path: "/booking-quotes",
		summary: "Create a booking quote",
		tags: ["BookingQuote"],
	})
	.input(CreateBookingQuoteInputSchema)
	.output(BookingQuoteComputedSchema)
	.handler(async ({ input, context }) => {
		const userId = context.session?.user?.id ?? null;

		if (!userId) {
			throw new ORPCError("UNAUTHORIZED");
		}

		return await createBookingQuote(input, userId);
	});

export const getBookingQuoteRoute = publicProcedure
	.route({
		method: "GET",
		path: "/booking-quotes/{id}",
		summary: "Get a booking quote by ID",
		tags: ["BookingQuote"],
	})
	.input(GetBookingQuoteInputSchema)
	.output(BookingQuoteComputedSchema)
	.handler(async ({ input }) => {
		const quote = await getBookingQuote(input.id);
		if (!quote) {
			throw new ORPCError("NOT_FOUND");
		}
		return computeBookingQuote(quote);
	});

export const cancelBookingQuoteRoute = publicProcedure
	.route({
		method: "POST",
		path: "/booking-quotes/{id}/cancel",
		summary: "Cancel a booking quote",
		tags: ["BookingQuote"],
	})
	.input(CancelBookingQuoteInputSchema)
	.output(BookingQuoteComputedSchema)
	.handler(async ({ input, context }) => {
		const quote = await getBookingQuote(input.id);
		if (!quote) {
			throw new ORPCError("NOT_FOUND");
		}
		if (quote.status !== "ACTIVE") {
			throw new ORPCError("BAD_REQUEST", {
				message: "Only active quotes can be cancelled",
			});
		}

		const updated = await updateBookingQuoteStatus(input.id, {
			status: "CANCELLED",
			cancelledAt: new Date(),
			events: {
				create: {
					type: "QUOTE_CANCELLED",
					actorUser: context.session?.user?.id
						? { connect: { id: context.session.user.id } }
						: undefined,
				},
			},
		});
		return computeBookingQuote(updated);
	});

export const bookingQuoteRouter = {
	create: createBookingQuoteRoute,
	get: getBookingQuoteRoute,
	cancel: cancelBookingQuoteRoute,
};
