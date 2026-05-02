import { createContext } from "@zanadeal/api/context";
import { subscribeToBookingStatsInvalidations } from "@zanadeal/api/features/booking-stats";
import type { FastifyInstance } from "fastify";
import { Role } from "../../../../packages/db/prisma/generated/enums";
import type { Env } from "../config/env";
import { buildCorsResponseHeaders, isCorsOriginAllowed } from "./cors";

function formatSseEvent(event: string, data: unknown) {
	return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function registerBookingStatsEventsRoute(
	fastify: FastifyInstance,
	env: Env,
) {
	fastify.get("/api/booking-stats/events", async (request, reply) => {
		const origin =
			typeof request.headers.origin === "string"
				? request.headers.origin
				: undefined;

		if (!isCorsOriginAllowed(env, origin)) {
			reply.code(403).send({ error: "FORBIDDEN_ORIGIN" });
			return;
		}

		const context = await createContext(request.headers, request.log);
		const user = context.session?.user;

		if (!user || user.disabledAt || !user.roles?.includes(Role.ADMIN)) {
			reply.code(401).send({ error: "UNAUTHORIZED" });
			return;
		}

		reply.hijack();
		reply.raw.writeHead(200, {
			...buildCorsResponseHeaders(env, origin),
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"Content-Type": "text/event-stream; charset=utf-8",
			"X-Accel-Buffering": "no",
		});
		reply.raw.write(formatSseEvent("stats.connected", { ok: true }));

		const unsubscribe = subscribeToBookingStatsInvalidations((event) => {
			reply.raw.write(formatSseEvent("stats.invalidate", event));
		});

		const heartbeat = setInterval(() => {
			reply.raw.write(formatSseEvent("stats.heartbeat", { ok: true }));
		}, 25_000);

		request.raw.on("close", () => {
			clearInterval(heartbeat);
			unsubscribe();
		});
	});
}
