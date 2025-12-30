import z from "zod";

export const ForgotPasswordInputSchema = z.object({
	to: z.email(),
	variables: z.object({
		userName: z.string().min(1),
		resetUrl: z.string(),
	}),
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;
