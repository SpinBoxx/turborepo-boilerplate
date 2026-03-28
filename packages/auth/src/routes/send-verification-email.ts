import z from "zod";
import { sendVerificationEmailSchema } from "./schemas";
import {
	forwardToBetterAuth,
	logAuthRouteError,
	sendAuthFailure,
	sendInvalidAuthBody,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const sendVerificationEmailRouteHandler: AuthRouteHandler = async (
	request,
	reply,
) => {
	const parsedBody = await sendVerificationEmailSchema.safeParseAsync(
		request.body,
	);
	if (!parsedBody.success) {
		sendInvalidAuthBody(reply, z.treeifyError(parsedBody.error));
		return;
	}

	await forwardToBetterAuth(request, reply, parsedBody.data);
};

export async function handleSendVerificationEmailRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await sendVerificationEmailRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
