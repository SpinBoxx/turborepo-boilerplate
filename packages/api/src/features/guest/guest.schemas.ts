import * as z from "zod";

export const GuestSchema = z.object({
	id: z.string().min(1),
	bookingId: z.string().min(1).nullable(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	email: z.email(),
	phoneNumber: z.string().min(1).nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Guest = z.infer<typeof GuestSchema>;

export const GetGuestInputSchema = z.object({
	id: z.string(),
});

export const CreateGuestInputSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	email: z.email(),
	phoneNumber: z.string().min(1).nullable().optional(),
});

export type CreateGuestInput = z.infer<typeof CreateGuestInputSchema>;
export type GetGuestInput = z.infer<typeof GetGuestInputSchema>;
