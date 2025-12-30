import prisma from "@zanadeal/db";
import { mailService } from "@zanadeal/mailer";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

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
					userName: user.name,
					confirmationUrl: url,
				},
				subject: "Veuillez vérifier votre compte",
			});
			console.log(mail);
		},
		sendOnSignUp: true,
	},
	user: {
		deleteUser: {
			enabled: true,
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
