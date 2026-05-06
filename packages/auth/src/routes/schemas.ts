import z from "zod";

export const signUpEmailSchema = z
	.object({
		email: z.email(),
		firstName: z.string().min(1),
		lastName: z.string().min(1),
		password: z.string().min(8),
		callbackURL: z.string().optional(),
		image: z.string().optional(),
		rememberMe: z.boolean().optional(),
	})
	.strict();

export const signInEmailSchema = z
	.object({
		email: z.email(),
		password: z.string().min(8),
		callbackURL: z.string().optional(),
		rememberMe: z.boolean().optional(),
	})
	.strict();

export const sendVerificationEmailSchema = z
	.object({
		email: z.email(),
		callbackURL: z.string().optional(),
	})
	.strict();

export const requestPasswordResetSchema = z
	.object({
		email: z.email(),
		redirectTo: z.string().optional(),
	})
	.strict();

export const resetPasswordSchema = z
	.object({
		token: z.string().min(1),
		newPassword: z.string().min(8),
	})
	.strict();

export const verifyEmailQuerySchema = z
	.object({
		token: z.string().min(1),
		callbackURL: z.string().optional(),
	})
	.strict();

export const resetPasswordCallbackQuerySchema = z
	.object({
		callbackURL: z.string().min(1),
	})
	.strict();

export type sendVerificationEmailType = z.infer<
	typeof sendVerificationEmailSchema
>;

export type RequestPasswordResetInput = z.infer<
	typeof requestPasswordResetSchema
>;

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
