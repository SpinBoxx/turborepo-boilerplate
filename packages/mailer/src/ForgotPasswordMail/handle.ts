import { resend } from "../resend";
import { type ForgotPasswordInput, ForgotPasswordInputSchema } from "./types";

export const sendForgotPasswordMail = async (input: ForgotPasswordInput) => {
	const parsed = ForgotPasswordInputSchema.parse(input);

	return resend.emails.send({
		template: {
			id: "31585737-a7e2-4a7e-8563-c867a7275348",
			variables: {
				...parsed.variables,
			},
		},
		subject: parsed.subject,
		from: parsed.from,
		to: parsed.to,
	});
};
