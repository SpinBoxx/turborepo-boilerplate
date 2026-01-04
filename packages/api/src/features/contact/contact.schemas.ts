import * as z from "zod";

export const ContactSchema = z.object({
	id: z.string().min(1),
	email: z.email(),
	note: z.string().min(1),
	phoneNumber: z.string().min(1).nullable(),
	name: z.string().min(1),
	hotelId: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Contact = z.infer<typeof ContactSchema>;

export const GetContactInputSchema = z.object({
	id: z.string(),
});

export const CreateContactInputSchema = z.object({
	email: z.email(),
	note: z.string().min(1),
	phoneNumber: z.string().min(1).nullable().optional(),
	name: z.string().min(1),
	hotelId: z.string().min(1),
});

export const ListContactsByHotelInputSchema = z.object({
	hotelId: z.string(),
	cursor: z.string().optional(),
	take: z.number().int().min(1).max(100).optional(),
});

export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;
export type GetContactInput = z.infer<typeof GetContactInputSchema>;
export type ListContactsByHotelInput = z.infer<
	typeof ListContactsByHotelInputSchema
>;
