import type { FastifyCorsOptions } from "@fastify/cors";
import type { Env } from "../config/env";

export function isCorsOriginAllowed(env: Env, origin: string | undefined) {
	if (!origin) return true;
	if (env.corsOrigins.length === 0) {
		return !env.isProd;
	}
	return env.corsOrigins.includes(origin);
}

export function buildCorsResponseHeaders(
	env: Env,
	origin: string | undefined,
): Record<string, string> {
	if (!origin || !isCorsOriginAllowed(env, origin)) {
		return {};
	}

	return {
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Origin": origin,
		Vary: "Origin",
	};
}

export function buildCorsConfig(env: Env): FastifyCorsOptions {
	return {
		origin: (origin, cb) => {
			// Non-browser clients (no Origin header) are allowed.
			return cb(null, isCorsOriginAllowed(env, origin));
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"X-CSRF-Token",
		],
		credentials: true,
		maxAge: 86400,
	};
}
