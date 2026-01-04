import prisma from "@zanadeal/db";
import { mailService } from "@zanadeal/mailer";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { User } from "../../db/prisma/generated/client";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ url, user }, _request) => {
			const mail = await mailService.sendVerifyAccountMail({
				to: user.email,
				variables: {
					// @ts-expect-error
					userName: (user as User).firstName,
					confirmationUrl: url,
				},
				subject: "Veuillez vérifier votre compte",
			});
			console.log(mail);
		},
		sendOnSignUp: true,
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
				type: "string",
			},
			kyc_verified: {
				required: false,
				returned: true,
				type: "boolean",
			},
			roles: {
				required: false,
				returned: true,
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
