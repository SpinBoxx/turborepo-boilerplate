export type Env = {
	isProd: boolean;
	corsOriginRaw: string | undefined;
	corsOrigins: string[];
	trustProxy: boolean;
	bodyLimitBytes: number;
	maxParamLength: number;
	maxEventLoopDelayMs: number;
	maxHeapUsedBytes: number;
	maxRssBytes: number;
	retryAfterSeconds: number;
	rateLimitMax: number;
	rateLimitWindow: string;
	authRateLimitMax: number;
	authRateLimitWindow: string;
	exposeApiReference: boolean;
	port: number;
	host: string;
	nodeEnv: string | undefined;
};

function parseCorsOrigins(value: string | undefined): string[] {
	if (!value) return [];
	return value
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
	if (value == null) return fallback;
	return value === "true";
}

function parseNumber(value: string | undefined, fallback: number): number {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

export function loadEnv(processEnv: NodeJS.ProcessEnv = process.env): Env {
	const nodeEnv = processEnv.NODE_ENV;
	const isProd = nodeEnv === "production";

	const corsOriginRaw = processEnv.CORS_ORIGIN;
	const corsOrigins = parseCorsOrigins(corsOriginRaw);

	if (isProd && corsOrigins.length === 0) {
		throw new Error(
			"CORS_ORIGIN is required in production (comma-separated list of allowed origins)",
		);
	}

	return {
		nodeEnv,
		isProd,
		corsOriginRaw,
		corsOrigins,
		trustProxy: parseBoolean(processEnv.TRUST_PROXY, isProd),
		bodyLimitBytes: parseNumber(processEnv.BODY_LIMIT_BYTES, 1024 * 1024),
		maxParamLength: parseNumber(processEnv.MAX_PARAM_LENGTH, 200),
		maxEventLoopDelayMs: parseNumber(processEnv.MAX_EVENT_LOOP_DELAY_MS, 500),
		maxHeapUsedBytes: parseNumber(
			processEnv.MAX_HEAP_USED_BYTES,
			512 * 1024 * 1024,
		),
		maxRssBytes: parseNumber(processEnv.MAX_RSS_BYTES, 1024 * 1024 * 1024),
		retryAfterSeconds: parseNumber(processEnv.RETRY_AFTER_SECONDS, 30),
		rateLimitMax: parseNumber(processEnv.RATE_LIMIT_MAX, 300),
		rateLimitWindow: processEnv.RATE_LIMIT_WINDOW || "1 minute",
		authRateLimitMax: parseNumber(processEnv.AUTH_RATE_LIMIT_MAX, 20),
		authRateLimitWindow: processEnv.AUTH_RATE_LIMIT_WINDOW || "1 minute",
		exposeApiReference: parseBoolean(processEnv.EXPOSE_API_REFERENCE, false),
		port: parseNumber(processEnv.PORT, 8080),
		host: processEnv.HOST || "0.0.0.0",
	};
}
