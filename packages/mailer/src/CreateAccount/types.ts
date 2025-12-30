import z from "zod";

export const CreateAccountMail = z.object({
	id: z.enum(["4990b843-aef7-4d36-b418-f44bae480060"]),
	variables: z.object({
		userName: z.string().min(1),
	}),
	to: z.email(),
	subject: z.string().min(1),
});
