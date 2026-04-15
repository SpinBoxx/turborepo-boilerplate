import { handleStripeCheckoutSessionCompletedWebhook } from "@zanadeal/api/features/payment";
import type { FastifyInstance } from "fastify";
import Stripe from "stripe";
import { z } from "zod";

const stripeWebhookConfigSchema = z.object({
	STRIPE_SECRET_KEY: z.string().min(1),
	STRIPE_WEBHOOK_SECRET: z.string().min(1),
});

let stripeClient: Stripe | null = null;

export async function registerStripeWebhookRoute(fastify: FastifyInstance) {
	await fastify.register(async (stripeWebhookScope) => {
		stripeWebhookScope.addContentTypeParser(
			"application/json",
			{ parseAs: "buffer" },
			(_request, body, done) => {
				done(null, body);
			},
		);

		stripeWebhookScope.post(
			"/webhooks/stripe",
			{ config: { rateLimit: false } },
			async (request, reply) => {
				const signature = request.headers["stripe-signature"];
				if (typeof signature !== "string" || signature.length === 0) {
					reply.code(400).send({ error: "Missing Stripe signature" });
					return;
				}

				if (!Buffer.isBuffer(request.body)) {
					reply.code(400).send({ error: "Stripe webhook body must be raw" });
					return;
				}

				let event: Stripe.Event;
				try {
					event = getStripeClient().webhooks.constructEvent(
						request.body,
						signature,
						getStripeWebhookConfig().webhookSecret,
					);
				} catch (error) {
					request.log.warn(
						{ error },
						"Rejected Stripe webhook because signature verification failed",
					);
					reply.code(400).send({ error: "Invalid Stripe signature" });
					return;
				}

				if (event.type !== "checkout.session.completed") {
					reply.code(200).send({ received: true });
					return;
				}

				const session = event.data.object;
				const paymentAttemptId = session.metadata?.paymentAttemptId;
				if (!paymentAttemptId) {
					request.log.warn(
						{ eventId: event.id, providerSessionId: session.id },
						"Stripe checkout.session.completed webhook ignored because paymentAttemptId metadata is missing",
					);
					reply.code(200).send({ ignored: true, received: true });
					return;
				}

				const result = await handleStripeCheckoutSessionCompletedWebhook({
					logger: request.log,
					paymentAttemptId,
					providerPaymentStatus: session.payment_status ?? null,
					providerSessionId: session.id,
					providerSessionStatus: session.status ?? "complete",
				});

				reply.code(200).send({
					handled: result.handled,
					hotelEmailStatus: result.hotelEmailStatus ?? null,
					reason: result.reason ?? null,
					received: true,
				});
			},
		);
	});
}

function getStripeWebhookConfig(processEnv: NodeJS.ProcessEnv = process.env) {
	const parsed = stripeWebhookConfigSchema.safeParse(processEnv);

	if (!parsed.success) {
		throw new Error("Stripe webhook configuration is missing");
	}

	return {
		secretKey: parsed.data.STRIPE_SECRET_KEY,
		webhookSecret: parsed.data.STRIPE_WEBHOOK_SECRET,
	};
}

function getStripeClient(processEnv: NodeJS.ProcessEnv = process.env) {
	if (stripeClient) {
		return stripeClient;
	}

	const { secretKey } = getStripeWebhookConfig(processEnv);
	stripeClient = new Stripe(secretKey);

	return stripeClient;
}