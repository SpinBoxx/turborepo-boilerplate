import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { Context } from "@zanadeal/api/context";
import type { AppRouter } from "@zanadeal/api/routers/index";

export type OrpcHandlers = {
	rpc: RPCHandler<Context>;
	apiRoutes: OpenAPIHandler<Context>;
	apiReference: OpenAPIHandler<Context>;
};

export function createOrpcHandlers(
	appRouter: AppRouter,
	options: { corsOrigin: string | undefined },
): OrpcHandlers {
	const rpc = new RPCHandler(appRouter, {
		plugins: [
			new CORSPlugin({
				origin: options.corsOrigin,
				credentials: true,
				allowHeaders: ["Content-Type", "Authorization"],
			}),
		],
		interceptors: [
			onError((error) => {
				console.error(error);
			}),
		],
	});

	// Expose OpenAPI-compatible HTTP routes (GET/POST/...) defined via `.route({ method, path })`.
	// Example: hotel routes are reachable at `/api/hotels`.
	const apiRoutes = new OpenAPIHandler(appRouter, {
		interceptors: [
			onError((error) => {
				console.error(error);
			}),
		],
	});

	// Expose OpenAPI reference UI/spec under a dedicated prefix.
	// NOTE: Use the Zod v4 converter to avoid invalid JSON Schema generation.
	const apiReference = new OpenAPIHandler(appRouter, {
		plugins: [
			new OpenAPIReferencePlugin({
				schemaConverters: [new ZodToJsonSchemaConverter()],
			}),
		],
		interceptors: [
			onError((error) => {
				console.error(error);
			}),
		],
	});

	return { rpc, apiRoutes, apiReference };
}
