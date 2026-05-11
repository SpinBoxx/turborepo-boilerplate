import z from "zod";
import { requestPasswordResetSchema } from "./schemas";
import {
	forwardToBetterAuth,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthBody,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const requestPasswordResetRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const parsedBody = await requestPasswordResetSchema.safeParseAsync(
		request.body,
	);
	if (!parsedBody.success) {
		sendInvalidAuthBody(reply, z.treeifyError(parsedBody.error));
		return;
	}

	await forwardToBetterAuth(request, reply, parsedBody.data);
};

export async function handleRequestPasswordResetRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await requestPasswordResetRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
