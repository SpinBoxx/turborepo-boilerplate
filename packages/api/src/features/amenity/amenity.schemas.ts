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

export const ListAmenitiesInputSchema = z.object({
	cursor: z.string().optional(),
	take: z.number().int().min(1).max(100).optional(),
});

export const CreateAmenityInputSchema = z.object({
	name: z.string().min(1),
	icon: z.string().min(1),
});

export const UpdateAmenityInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1).optional(),
	icon: z.string().min(1).optional(),
});

export const DeleteAmenityInputSchema = z.object({
	id: z.string().min(1),
});

export type CreateAmenityInput = z.infer<typeof CreateAmenityInputSchema>;
export type GetAmenityInput = z.infer<typeof GetAmenityInputSchema>;
export type ListAmenitiesInput = z.infer<typeof ListAmenitiesInputSchema>;
export type UpdateAmenityInput = z.infer<typeof UpdateAmenityInputSchema>;
export type DeleteAmenityInput = z.infer<typeof DeleteAmenityInputSchema>;
