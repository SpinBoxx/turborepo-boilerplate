import z from "zod";
import { signUpEmailSchema } from "./schemas";
import {
	forwardToBetterAuth,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthBody,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const signUpEmailRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const parsedBody = await signUpEmailSchema.safeParseAsync(request.body);
	if (!parsedBody.success) {
		sendInvalidAuthBody(reply, z.treeifyError(parsedBody.error));
		return;
	}

	await forwardToBetterAuth(request, reply, parsedBody.data);
};

export async function handleSignUpEmailRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await signUpEmailRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
