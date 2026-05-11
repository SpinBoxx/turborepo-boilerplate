import z from "zod";
import { resetPasswordSchema } from "./schemas";
import {
	forwardToBetterAuth,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthBody,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const resetPasswordRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const parsedBody = await resetPasswordSchema.safeParseAsync(request.body);
	if (!parsedBody.success) {
		sendInvalidAuthBody(reply, z.treeifyError(parsedBody.error));
		return;
	}

	await forwardToBetterAuth(request, reply, parsedBody.data);
};

export async function handleResetPasswordRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await resetPasswordRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
