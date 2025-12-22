import type { IncomingHttpHeaders } from "node:http";
import { auth } from "@zanadeal/auth";
import type { FastifyInstance } from "fastify";

function nodeHeadersToWebHeaders(headers: IncomingHttpHeaders): Headers {
	const webHeaders = new Headers();
	Object.entries(headers).forEach(([key, value]) => {
		if (value) webHeaders.append(key, value.toString());
	});
	return webHeaders;
}

export function registerAuthRoutes(
	fastify: FastifyInstance,
	env: { authRateLimitMax: number; authRateLimitWindow: string },
) {
	fastify.route({
		method: ["GET", "POST"],
		url: "/api/auth/*",
		config: {
			rateLimit: {
				max: env.authRateLimitMax,
				timeWindow: env.authRateLimitWindow,
			},
		},
		async handler(request, reply) {
			try {
				const url = new URL(request.url, `http://${request.headers.host}`);
				const headers = nodeHeadersToWebHeaders(request.headers);

				let body: undefined | string | Buffer;
				if (request.method !== "GET" && request.method !== "HEAD") {
					const rawBody = request.body as unknown;
					if (typeof rawBody === "string") body = rawBody;
					else if (Buffer.isBuffer(rawBody)) body = rawBody;
					else if (rawBody != null) body = JSON.stringify(rawBody);
				}

				const req = new Request(url.toString(), {
					method: request.method,
					headers,
					body,
				});

				const response = await auth.handler(req);
				reply.status(response.status);
				response.headers.forEach((value, key) => {
					reply.header(key, value);
				});
				reply.send(response.body ? await response.text() : null);
			} catch (error) {
				fastify.log.error({ err: error }, "Authentication Error:");
				reply.status(500).send({
					error: "Internal authentication error",
					code: "AUTH_FAILURE",
				});
			}
		},
	});
}
