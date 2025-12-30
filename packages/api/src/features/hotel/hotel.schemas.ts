import * as z from "zod";

export const HotelSchema = z.object({
	id: z.number().int().min(1),
	name: z.string().min(1),
	city: z.string().min(1),
});

export type Hotel = z.infer<typeof HotelSchema>;

export const GetHotelInputSchema = z.object({
	id: z.string(),
});

export const CreateHotelInputSchema = HotelSchema.omit({ id: true });

export type CreateHotelInput = z.infer<typeof CreateHotelInputSchema>;
export type GetHotelInput = z.infer<typeof GetHotelInputSchema>;
