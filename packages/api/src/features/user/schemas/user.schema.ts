import z from "zod";
import { Role } from "../../../../../db/prisma/generated/enums";

export const UpsertUserInputSchema = z.object({
	email: z.email(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	password: z.string().min(8),
});

export const LoginInputSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export const UserComputedSchema = z.object({
	id: z.string(),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	emailVerified: z.boolean(),
	roles: z.enum(Role).array(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type UpsertUserInput = z.infer<typeof UpsertUserInputSchema>;
export type UserComputed = z.infer<typeof UserComputedSchema>;
