import { handleSendVerificationEmailRoute } from "./send-verification-email";
import { createAuthRouteConfig } from "./shared";
import { handleSignInEmailRoute } from "./sign-in-email";
import { handleSignOutRoute } from "./sign-out";
import { handleSignUpEmailRoute } from "./sign-up-email";
import type { AuthRouteEnv, AuthRouteRegistrar } from "./types";
import { handleVerifyEmailRoute } from "./verify-email";

export function registerAuthRoutes(
	registrar: AuthRouteRegistrar,
	env: AuthRouteEnv,
) {
	const options = { config: createAuthRouteConfig(env) };

	registrar.post("/api/auth/sign-up/email", options, async (request, reply) => {
		await handleSignUpEmailRoute(registrar.log, request, reply);
	});

	registrar.post("/api/auth/sign-in/email", options, async (request, reply) => {
		await handleSignInEmailRoute(registrar.log, request, reply);
	});

	registrar.post("/api/auth/sign-out", options, async (request, reply) => {
		await handleSignOutRoute(registrar.log, request, reply);
	});

	registrar.post(
		"/api/auth/send-verification-email",
		options,
		async (request, reply) => {
			await handleSendVerificationEmailRoute(registrar.log, request, reply);
		},
	);

	registrar.get("/api/auth/verify-email", options, async (request, reply) => {
		await handleVerifyEmailRoute(registrar.log, request, reply);
	});
}
