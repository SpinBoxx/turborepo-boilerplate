import * as z from "zod";

export const HotelImageSchema = z.object({
	id: z.string().min(1),
	url: z.string().min(1),
	publicId: z.string().min(1),
	hotelId: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type HotelImage = z.infer<typeof HotelImageSchema>;

export const GetHotelImageInputSchema = z.object({
	id: z.string(),
});

export const CreateHotelImageInputSchema = z.object({
	url: z.string().min(1),
	publicId: z.string().min(1),
	hotelId: z.string().min(1),
});

export type CreateHotelImageInput = z.infer<typeof CreateHotelImageInputSchema>;
export type GetHotelImageInput = z.infer<typeof GetHotelImageInputSchema>;
