import type { IncomingHttpHeaders } from "node:http";
import { auth } from "@zanadeal/auth";
import { fromNodeHeaders } from "better-auth/node";

export type LoggerLike = {
	info: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	debug?: (...args: unknown[]) => void;
};

export async function createContext(
	req: IncomingHttpHeaders,
	logger?: LoggerLike,
) {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req),
	});
	return {
		session,
		logger,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
