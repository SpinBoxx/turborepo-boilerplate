import * as z from "zod";

export const AmenitySchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	icon: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Amenity = z.infer<typeof AmenitySchema>;

export const GetAmenityInputSchema = z.object({
	id: z.string(),
});

export const CreateAmenityInputSchema = z.object({
	name: z.string().min(1),
	icon: z.string().min(1),
});

export type CreateAmenityInput = z.infer<typeof CreateAmenityInputSchema>;
export type GetAmenityInput = z.infer<typeof GetAmenityInputSchema>;
