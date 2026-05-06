import { verifyLocale } from "../mail-locales";
import { resend } from "../resend";
import { type ForgotPasswordInput, ForgotPasswordInputSchema } from "./types";

export const sendForgotPasswordMail = async (input: ForgotPasswordInput) => {
	const parsed = await ForgotPasswordInputSchema.safeParseAsync(input);

	if (!parsed.success) {
		throw new Error("Invalid input for sendForgotPasswordMail");
	}

	const locale = verifyLocale(parsed.data.locale);
	const subject = parsed.data.subject ?? emailSubjects[locale];

	const sendEmail = await resend.emails.send({
		template: {
			id: emails[locale],
			variables: {
				...parsed.data.variables,
			},
		},
		subject,
		from: parsed.data.from,
		to: parsed.data.to,
	});

	if (sendEmail.error || !sendEmail.data?.id) {
		throw new Error(
			`Failed to send forgot password email: ${sendEmail.error?.message ?? "Unknown Resend error"}`,
		);
	}

	return {
		emailId: sendEmail.data.id,
	};
};

const emails = {
	fr: "b922232f-bfbc-4f7e-8df8-54d13f992194",
	en: "a906c772-d198-4c80-93ff-5916209e354c",
	mg: "50a9d23b-bf1f-471c-bf37-b1688b01e508",
};

const emailSubjects = {
	fr: "Reinitialisez votre mot de passe",
	en: "Reset your password",
	mg: "Havaozy ny tenimiafinao",
} as const;
