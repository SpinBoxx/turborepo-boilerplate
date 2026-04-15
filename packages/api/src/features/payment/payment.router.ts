import { protectedProcedure } from "../../index";
import {
	GetPaymentStatusInputSchema,
	GetPaymentStatusResultSchema,
	StartPaymentInputSchema,
	StartPaymentResultSchema,
} from "./payment.schemas";
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
			logger: context.logger,
		});
	});

export const paymentRouter = {
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
				logger: context.logger,
			});
		}),
	start: startPaymentRoute,
};