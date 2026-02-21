import { inspect } from "node:util";
import type { Context } from "@zanadeal/api/context";

type Logger = Context["logger"];

type OrpcInterceptorOptions = {
	context: Context;
	prefix?: unknown;
	request: {
		method: string;
		url: URL;
		body: () => Promise<unknown>;
	};
};

function redactSensitive(value: unknown, maxStringLength = 2_000): unknown {
	const seen = new WeakSet<object>();
	const sensitiveKey =
		/pass(word)?|secret|token|api[-_]?key|authorization|cookie|set-cookie/i;

	function walk(input: unknown): unknown {
		if (input == null) return input;
		if (typeof input === "string") {
			return input.length > maxStringLength
				? `${input.slice(0, maxStringLength)}…(truncated)`
				: input;
		}
		if (typeof input !== "object") return input;
		if (input instanceof URL) return input.toString();
		if (input instanceof Date) return input.toISOString();
		if (Array.isArray(input)) return input.map(walk);

		const obj = input as Record<string, unknown>;
		if (seen.has(obj)) return "[Circular]";
		seen.add(obj);

		const out: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(obj)) {
			out[key] = sensitiveKey.test(key) ? "[REDACTED]" : walk(val);
		}
		return out;
	}

	return walk(value);
}

function formatIssues(issues: unknown) {
	if (!Array.isArray(issues)) return undefined;
	return issues.map((issue) => {
		const i = issue as Record<string, unknown>;
		return {
			path: Array.isArray(i.path) ? i.path : undefined,
			code: typeof i.code === "string" ? i.code : undefined,
			expected: typeof i.expected === "string" ? i.expected : undefined,
			received: typeof i.received === "string" ? i.received : undefined,
			message: typeof i.message === "string" ? i.message : undefined,
		};
	});
}

function extractRpcDetails(body: unknown):
	| undefined
	| {
			procedure: string | undefined;
			input: unknown;
	  } {
	if (!body || typeof body !== "object") return undefined;
	const record = body as Record<string, unknown>;
	const rawPath = record.path;
	const procedure =
		typeof rawPath === "string"
			? rawPath
			: Array.isArray(rawPath)
				? rawPath.filter((p): p is string => typeof p === "string").join(".")
				: undefined;

	return {
		procedure,
		input: record.input,
	};
}

function extractOrpcErrorDetails(error: unknown):
	| undefined
	| {
			code?: unknown;
			status?: unknown;
			defined?: unknown;
			data?: unknown;
			issues?: unknown;
	  } {
	if (!error || typeof error !== "object") return undefined;
	const record = error as Record<string, unknown>;
	const data = record.data;
	const issues =
		data && typeof data === "object"
			? (data as Record<string, unknown>).issues
			: undefined;
	return {
		code: record.code,
		status: record.status,
		defined: record.defined,
		data,
		issues,
	};
}

async function safeReadBody(request: OrpcInterceptorOptions["request"]) {
	try {
		return await request.body();
	} catch (readError) {
		return { bodyReadError: (readError as Error)?.message ?? readError };
	}
}

export async function logOrpcError(params: {
	kind: "rpc" | "openapi-route" | "openapi-reference";
	error: unknown;
	options: OrpcInterceptorOptions;
	message: string;
}): Promise<void> {
	const logger: Logger = params.options.context.logger;
	if (!logger) return;

	const body = await safeReadBody(params.options.request);
	const rpcDetails =
		params.kind === "rpc" ? extractRpcDetails(body) : undefined;
	const orpcDetails = extractOrpcErrorDetails(params.error);
	console.error(
		inspect(
			redactSensitive({
				orpcDetails,
				body,
				error: params.error,
			}),
			{
				depth: Number.POSITIVE_INFINITY,
				colors: true,
				compact: false,
				maxArrayLength: null,
				maxStringLength: null,
			},
		),
	);

	logger.error(
		{
			err: params.error,
			orpc: {
				kind: params.kind,
				method: params.options.request.method,
				pathname: params.options.request.url.pathname,
				search: params.options.request.url.search || undefined,
				prefix: params.options.prefix,
				procedure: rpcDetails?.procedure,
				code: orpcDetails?.code,
				status: orpcDetails?.status,
				defined: orpcDetails?.defined,
				issues: formatIssues(orpcDetails?.issues),
			},
			input: redactSensitive(rpcDetails?.input),
			requestBody: redactSensitive(body),
		},
		params.message,
	);
}
