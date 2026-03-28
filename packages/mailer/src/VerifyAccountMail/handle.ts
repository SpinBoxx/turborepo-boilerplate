import { resend } from "../resend";
import {
	type VerifyAccountMailInput,
	VerifyAccountMailInputSchema,
} from "./types";

export const sendVerifyAccountMail = async (input: VerifyAccountMailInput) => {
	const parsed = await VerifyAccountMailInputSchema.safeParseAsync(input);

	if (!parsed.success) {
		throw new Error("Invalid input for sendVerifyAccountMail");
	}

	const { locale } = parsed.data;

	return resend.emails.send({
		template: {
			id: emails[locale],

			variables: {
				...parsed.data.variables,
			},
		},
		subject: parsed.data.subject,
		from: parsed.data.from,
		to: parsed.data.to,
	});
};

const emails = {
	fr: "6baaad54-49ed-43e6-b322-cf9f9ef91b84",
	en: "516f21ce-4f9c-4695-a7b0-7ab72bb8c723",
	mg: "e4221b50-1273-46d6-9638-44dcf6356ad3",
};
