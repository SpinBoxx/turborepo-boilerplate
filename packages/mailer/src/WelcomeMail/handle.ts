import { resend } from "../resend";
import {
	type CreateAccountMailInput,
	CreateAccountMailInputSchema,
} from "./types";

export const sendWelcomeMail = async (input: CreateAccountMailInput) => {
	const parsed = CreateAccountMailInputSchema.parse(input);

	return resend.emails.send({
		template: {
			id: "4990b843-aef7-4d36-b418-f44bae480060",
			variables: {
				...parsed.variables,
			},
		},
		subject: parsed.subject ?? "Bienvenue sur Zanadeal",
		from: parsed.from ?? "contact@zanadeal.com",
		to: parsed.to,
	});
};
