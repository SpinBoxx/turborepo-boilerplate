import z from "zod";
import { resetPasswordCallbackQuerySchema } from "./schemas";
import {
	forwardToBetterAuth,
	getAuthRequestUrl,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthQuery,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const resetPasswordCallbackRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const url = getAuthRequestUrl(request);
	const rawQuery = Object.fromEntries(url.searchParams.entries());
	const parsedQuery = resetPasswordCallbackQuerySchema.safeParse(rawQuery);
	if (!parsedQuery.success) {
		sendInvalidAuthQuery(reply, z.treeifyError(parsedQuery.error));
		return;
	}

	await forwardToBetterAuth(request, reply);
};

export async function handleResetPasswordCallbackRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await resetPasswordCallbackRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
