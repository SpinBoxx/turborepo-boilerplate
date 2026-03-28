import type { IncomingHttpHeaders } from "node:http";

export type AuthRouteEnv = {
	authRateLimitMax: number;
	authRateLimitWindow: string;
};

export type AuthRateLimitConfig = {
	max: number;
	timeWindow: string;
};

export type AuthRequestLike = {
	body: unknown;
	headers: IncomingHttpHeaders;
	method: string;
	url: string;
};

export type AuthReplyLike = {
	header: (key: string, value: string) => void;
	status: (code: number) => { send: (payload: unknown) => void };
	send: (payload: unknown) => void;
};

export type AuthLoggerLike = {
	error: (context: unknown, message?: string) => void;
};

export type AuthRouteHandler = (
	request: AuthRequestLike,
	reply: AuthReplyLike,
) => Promise<void>;

export type AuthRouteRegistrar = {
	log: AuthLoggerLike;
	post: (
		path: string,
		options: { config: { rateLimit: AuthRateLimitConfig } },
		handler: AuthRouteHandler,
	) => void;
	get: (
		path: string,
		options: { config: { rateLimit: AuthRateLimitConfig } },
		handler: AuthRouteHandler,
	) => void;
};
