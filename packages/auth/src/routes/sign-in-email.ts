import z from "zod";
import { signInEmailSchema } from "./schemas";
import {
	forwardToBetterAuth,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthBody,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const signInEmailRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const parsedBody = await signInEmailSchema.safeParseAsync(request.body);
	if (!parsedBody.success) {
		sendInvalidAuthBody(reply, z.treeifyError(parsedBody.error));
		return;
	}

	await forwardToBetterAuth(request, reply, parsedBody.data);
};

export async function handleSignInEmailRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await signInEmailRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
