import z from "zod";
import { verifyEmailQuerySchema } from "./schemas";
import {
	forwardToBetterAuth,
	getAuthRequestUrl,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthQuery,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const verifyEmailRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const url = getAuthRequestUrl(request);
	const rawQuery = Object.fromEntries(url.searchParams.entries());
	const parsedQuery = verifyEmailQuerySchema.safeParse(rawQuery);
	if (!parsedQuery.success) {
		sendInvalidAuthQuery(reply, z.treeifyError(parsedQuery.error));
		return;
	}

	await forwardToBetterAuth(request, reply);
};

export async function handleVerifyEmailRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await verifyEmailRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
