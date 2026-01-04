import * as z from "zod";

export const VerifyAccountMailInputSchema = z.object({
	to: z.email(),
	variables: z.object({
		userName: z.string().min(1),
		confirmationUrl: z.string(),
	}),
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type VerifyAccountMailInput = z.infer<
	typeof VerifyAccountMailInputSchema
>;
