import {
	forwardToBetterAuth,
	logAuthRouteError,
	sendAuthFailure,
} from "./shared";
import type { AuthRouteHandler } from "./types";

export const signOutRouteHandler: AuthRouteHandler = async (request, reply) => {
	await forwardToBetterAuth(request, reply);
};

export async function handleSignOutRoute(
	logger: { error: (context: unknown, message?: string) => void },
	request: Parameters<AuthRouteHandler>[0],
	reply: Parameters<AuthRouteHandler>[1],
) {
	try {
		await signOutRouteHandler(request, reply);
	} catch (error) {
		logAuthRouteError(logger, error);
		sendAuthFailure(reply);
	}
}
