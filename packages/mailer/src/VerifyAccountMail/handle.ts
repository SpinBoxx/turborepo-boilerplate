import { resend } from "../resend";
import {
	type VerifyAccountMailInput,
	VerifyAccountMailInputSchema,
} from "./types";

export const sendVerifyAccountMail = async (input: VerifyAccountMailInput) => {
	const parsed = VerifyAccountMailInputSchema.parse(input);

	return resend.emails.send({
		template: {
			id: "658b5476-1413-4802-b0a4-a2fa0fd2787f",
			variables: {
				...parsed.variables,
			},
		},
		subject: parsed.subject,
		from: parsed.from,
		to: parsed.to,
	});
};
