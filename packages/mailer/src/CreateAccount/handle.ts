import { resend } from "../resend";

export const CreateAccountMail = async () => {
	const mail = await resend.emails.send({
		template: {
			id: "4990b843-aef7-4d36-b418-f44bae480060",
			variables: {
				userName: "Quentin Mimault",
			},
		},
		subject: "hello world",
		from: "contact@zanadeal.com",
		to: "quentin.mimault@orange.fr",
	});

	console.log(mail);
};
