import { registerAuthRoutes as registerPackageAuthRoutes } from "@zanadeal/auth";
import type { FastifyInstance } from "fastify";

export function registerAuthRoutes(
	fastify: FastifyInstance,
	env: { authRateLimitMax: number; authRateLimitWindow: string },
) {
	registerPackageAuthRoutes(fastify, env);
}
