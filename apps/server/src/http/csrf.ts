import type { FastifyInstance } from "fastify";
import type { Env } from "../config/env";

// Basic CSRF mitigation for cookie-based auth:
// Block cross-site state-changing requests when cookies are present.
export function registerCsrfProtection(fastify: FastifyInstance, env: Env) {
	fastify.addHook("onRequest", async (request, reply) => {
		const method = request.method;
		if (method === "GET" || method === "HEAD" || method === "OPTIONS") return;

		const hasCookie =
			typeof request.headers.cookie === "string" &&
			request.headers.cookie.length > 0;
		if (!hasCookie) return;

		const origin =
			typeof request.headers.origin === "string"
				? request.headers.origin
				: undefined;
		if (!origin) return;

		if (env.corsOrigins.length > 0 && !env.corsOrigins.includes(origin)) {
			reply.code(403).send({ error: "Forbidden", code: "CSRF_ORIGIN_BLOCKED" });
		}
	});
}
