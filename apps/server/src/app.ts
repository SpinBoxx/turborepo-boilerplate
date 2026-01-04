import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import underPressure from "@fastify/under-pressure";
import { createContext } from "@zanadeal/api/context";
import { appRouter } from "@zanadeal/api/routers/index";
import Fastify from "fastify";

import { registerAuthRoutes } from "./auth/route";
import { loadEnv } from "./config/env";
import { buildCorsConfig } from "./http/cors";
import { registerCsrfProtection } from "./http/csrf";
import { createOrpcHandlers } from "./orpc/handlers";

export async function createApp() {
	const env = loadEnv();
	const orpc = createOrpcHandlers(appRouter, { corsOrigin: env.corsOriginRaw });

	const fastify = Fastify({
		logger: true,
		trustProxy: env.trustProxy,
		bodyLimit: env.bodyLimitBytes,
		maxParamLength: env.maxParamLength,
	});

	await fastify.register(fastifyHelmet, {
		// API server: keep strong defaults, skip CSP to avoid breaking non-HTML clients.
		contentSecurityPolicy: false,
	});

	await fastify.register(underPressure, {
		maxEventLoopDelay: env.maxEventLoopDelayMs,
		maxHeapUsedBytes: env.maxHeapUsedBytes,
		maxRssBytes: env.maxRssBytes,
		retryAfter: env.retryAfterSeconds,
	});

	fastify.register(fastifyCors, buildCorsConfig(env));

	await fastify.register(fastifyRateLimit, {
		global: true,
		max: env.rateLimitMax,
		timeWindow: env.rateLimitWindow,
	});

	registerCsrfProtection(fastify, env);

	fastify.get("/health", async () => {
		return "OK";
	});

	fastify.all("/rpc/*", async (request, reply) => {
		const result = await orpc.rpc.handle(request, reply, {
			context: await createContext(request.headers, request.log),
			prefix: "/rpc",
		});
		if (!result.matched) {
			reply.code(404).send("Not Found");
		}
	});

	fastify.all("/api/*", async (request, reply) => {
		const result = await orpc.apiRoutes.handle(request, reply, {
			context: await createContext(request.headers, request.log),
			prefix: "/api",
		});
		if (!result.matched) {
			reply.code(404).send("Not Found");
		}
	});

	if (!env.isProd || env.exposeApiReference) {
		fastify.all("/api-reference/*", async (request, reply) => {
			const result = await orpc.apiReference.handle(request, reply, {
				context: await createContext(request.headers, request.log),
				prefix: "/api-reference",
			});
			if (!result.matched) {
				reply.code(404).send("Not Found");
			}
		});
	}

	registerAuthRoutes(fastify, {
		authRateLimitMax: env.authRateLimitMax,
		authRateLimitWindow: env.authRateLimitWindow,
	});

	fastify.get("/", async () => {
		return `OK${env.nodeEnv}`;
	});

	return { fastify, env };
}
