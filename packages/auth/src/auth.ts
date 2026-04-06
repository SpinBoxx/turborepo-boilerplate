import prisma from "@zanadeal/db";
import { mailService } from "@zanadeal/mailer";
import { verifyLocale } from "@zanadeal/mailer/resend";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { User } from "../../db/prisma/generated/client";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: process.env.CORS_ORIGIN?.split(",") || [],
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	baseURL: process.env.API_URL,
	emailVerification: {
		sendVerificationEmail: async ({ url, user }, request) => {
			const parsedUrl = new URL(url);
			const requestedCallbackUrl = parsedUrl.searchParams.get("callbackURL");
			parsedUrl.searchParams.set(
				"callbackURL",
				requestedCallbackUrl || `${process.env.CLIENT_URL}/email-verified`,
			);
			const localeFromHeaders = request?.headers.get("content-language");

			const locale = verifyLocale(localeFromHeaders);

			const mail = await mailService.sendVerifyAccountMail({
				locale,
				to: user.email,
				variables: {
					// @ts-expect-error
					userName: (user as User).firstName,
					confirmationUrl: parsedUrl.toString(),
				},
				subject: "Veuillez vérifier votre compte",
			});

			console.log(mail);
		},
		expiresIn: 60 * 60, // 1 hour

		sendOnSignUp: false,
	},
	user: {
		additionalFields: {
			firstName: {
				required: true,
				returned: true,
				type: "string",
			},
			lastName: {
				required: true,
				returned: true,
				type: "string",
			},
			kyc_session_id: {
				required: false,
				returned: true,
				input: false,
				type: "string",
			},
			kyc_verified: {
				required: false,
				returned: true,
				input: false,
				type: "boolean",
			},
			roles: {
				required: false,
				returned: true,
				input: false,
				type: "string[]",
			},
		},
		deleteUser: {
			enabled: true,
		},
	},
	session: {
		additionalFields: {
			firstName: {
				returned: true,
				type: "string",
			},
			lastName: {
				returned: true,
				type: "string",
			},
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
