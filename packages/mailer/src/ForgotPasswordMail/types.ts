import * as z from "zod";
import { LOCALES } from "../mail-locales";

export const ForgotPasswordInputSchema = z.object({
	to: z.email(),
	locale: z.enum(LOCALES),
	variables: z.object({
		userName: z.string().min(1),
		resetUrl: z.string(),
	}),
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;
