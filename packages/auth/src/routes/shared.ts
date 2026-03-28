import type { IncomingHttpHeaders } from "node:http";
import { auth } from "../auth";
import type {
	AuthLoggerLike,
	AuthReplyLike,
	AuthRequestLike,
	AuthRouteEnv,
} from "./types";

type JsonBody = Record<string, unknown>;

export function createAuthRouteConfig(env: AuthRouteEnv) {
	return {
		rateLimit: {
			max: env.authRateLimitMax,
			timeWindow: env.authRateLimitWindow,
		},
	};
}

export function nodeHeadersToWebHeaders(headers: IncomingHttpHeaders): Headers {
	const webHeaders = new Headers();
	Object.entries(headers).forEach(([key, value]) => {
		if (value) webHeaders.append(key, value.toString());
	});
	return webHeaders;
}

export function getAuthRequestUrl(request: {
	url: string;
	headers: IncomingHttpHeaders;
}) {
	return new URL(request.url, `http://${request.headers.host}`);
}

export function normalizeRequestBody(
	body: unknown,
): undefined | string | Buffer {
	if (typeof body === "string") return body;
	if (Buffer.isBuffer(body)) return body;
	if (body != null) return JSON.stringify(body);
	return undefined;
}

export async function forwardToBetterAuth(
	request: AuthRequestLike,
	reply: AuthReplyLike,
	bodyOverride?: unknown,
) {
	const url = getAuthRequestUrl(request);
	const headers = nodeHeadersToWebHeaders(request.headers);
	const body =
		request.method === "GET" || request.method === "HEAD"
			? undefined
			: normalizeRequestBody(bodyOverride ?? request.body);

	const authRequest = new Request(url.toString(), {
		method: request.method,
		headers,
		body,
	});

	const response = await auth.handler(authRequest);
	reply.status(response.status);
	response.headers.forEach((value, key) => {
		reply.header(key, value);
	});
	reply.send(response.body ? await response.text() : null);
}

export function sendInvalidAuthBody(reply: AuthReplyLike, details?: unknown) {
	reply.status(400).send({
		error: "Invalid request body for authentication",
		code: "INVALID_AUTH_BODY",
		details,
	} satisfies JsonBody);
}

export function sendInvalidAuthQuery(reply: AuthReplyLike, details?: unknown) {
	reply.status(400).send({
		error: "Invalid query for authentication",
		code: "INVALID_AUTH_QUERY",
		details,
	} satisfies JsonBody);
}

export function sendAuthFailure(reply: AuthReplyLike) {
	reply.status(500).send({
		error: "Internal authentication error",
		code: "AUTH_FAILURE",
	} satisfies JsonBody);
}

export function logAuthRouteError(logger: AuthLoggerLike, error: unknown) {
	logger.error({ err: error }, "Authentication Error:");
}
