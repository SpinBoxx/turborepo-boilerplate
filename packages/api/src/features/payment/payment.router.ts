import { adminProcedure, protectedProcedure } from "../../index";
import {
	GetPaymentStatusInputSchema,
	GetPaymentStatusResultSchema,
	ReviewBookingRequestInputSchema,
	ReviewBookingRequestResultSchema,
	StartPaymentInputSchema,
	StartPaymentResultSchema,
} from "./payment.schemas";
import { reviewBookingRequest } from "./booking-review.service";
import { getPaymentStatus } from "./payment-query.service";
import { startPayment } from "./payment.service";

export const startPaymentRoute = protectedProcedure
	.route({
		method: "POST",
		path: "/payments/start",
		summary: "Start a payment for a booking quote using a selected provider",
		tags: ["Payment"],
	})
	.input(StartPaymentInputSchema)
	.output(StartPaymentResultSchema)
	.handler(async ({ input, context }) => {
		return await startPayment({
			quoteId: input.quoteId,
			provider: input.provider,
			userId: context.session.user.id,
		});
	});

export const paymentRouter = {
	reviewBookingRequest: adminProcedure
		.route({
			method: "POST",
			path: "/bookings/requests/review",
			summary: "Accept or reject a hotel booking request backed by an authorized payment",
			tags: ["Payment", "Booking"],
		})
		.input(ReviewBookingRequestInputSchema)
		.output(ReviewBookingRequestResultSchema)
		.handler(async ({ input, context }) => {
			if (!context.session?.user) {
				throw new Error("Authenticated admin session is required");
			}

			return await reviewBookingRequest({
				actorUserId: context.session.user.id,
				decision: input.decision,
				paymentAttemptId: input.paymentAttemptId,
				rejectionReason: input.rejectionReason,
				validationNote: input.validationNote,
			});
		}),
	getStatus: protectedProcedure
		.route({
			method: "GET",
			path: "/payments/status/{paymentAttemptId}",
			summary: "Get the current public status of a payment attempt",
			tags: ["Payment"],
		})
		.input(GetPaymentStatusInputSchema)
		.output(GetPaymentStatusResultSchema)
		.handler(async ({ input, context }) => {
			return await getPaymentStatus({
				paymentAttemptId: input.paymentAttemptId,
				userId: context.session.user.id,
			});
		}),
	start: startPaymentRoute,
};