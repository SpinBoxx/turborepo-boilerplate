import * as z from "zod";

export const CreateAccountMailInputSchema = z.object({
	to: z.email(),
	variables: z.object({
		userName: z.string().min(1),
	}),
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type CreateAccountMailInput = z.infer<
	typeof CreateAccountMailInputSchema
>;
