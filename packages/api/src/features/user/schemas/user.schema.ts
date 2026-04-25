import z from "zod";
import { Role } from "../../../../../db/prisma/generated/enums";

export const ManagedUserBusinessRoleSchema = z.enum([
	Role.ADMIN,
	Role.HOTEL_REVIEWER,
]);

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
	disabledAt: z.date().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ManagedUserSchema = z.object({
	id: z.string(),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	emailVerified: z.boolean(),
	roles: z.enum(Role).array(),
	disabledAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateManagedUserInputSchema = z.object({
	email: z.email(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	password: z.string().min(8),
	role: ManagedUserBusinessRoleSchema,
});

export const UpdateManagedUserInputSchema = z.object({
	id: z.string().min(1),
	email: z.email().optional(),
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	role: ManagedUserBusinessRoleSchema.optional(),
});

export const DeactivateManagedUserInputSchema = z.object({
	id: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
export type UpsertUserInput = z.infer<typeof UpsertUserInputSchema>;
export type UserComputed = z.infer<typeof UserComputedSchema>;
export type ManagedUserBusinessRole = z.infer<
	typeof ManagedUserBusinessRoleSchema
>;
export type ManagedUser = z.infer<typeof ManagedUserSchema>;
export type CreateManagedUserInput = z.infer<
	typeof CreateManagedUserInputSchema
>;
export type UpdateManagedUserInput = z.infer<
	typeof UpdateManagedUserInputSchema
>;
export type DeactivateManagedUserInput = z.infer<
	typeof DeactivateManagedUserInputSchema
>;
