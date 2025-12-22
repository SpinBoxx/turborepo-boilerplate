import type { FastifyCorsOptions } from "@fastify/cors";
import type { Env } from "../config/env";

export function buildCorsConfig(env: Env): FastifyCorsOptions {
	return {
		origin: (origin, cb) => {
			// Non-browser clients (no Origin header) are allowed.
			if (!origin) return cb(null, true);
			if (env.corsOrigins.length === 0) {
				// Development convenience only. In production we require explicit allowlist.
				return cb(null, !env.isProd);
			}
			return cb(null, env.corsOrigins.includes(origin));
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
