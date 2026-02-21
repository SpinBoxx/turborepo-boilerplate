import * as z from "zod";
import {
	AmenityTranslationInputSchema,
	AmenityTranslationSchema,
} from "./amenity-translation.schemas";

export const AmenitySchema = z.object({
	id: z.string().min(1),
	slug: z.string().min(1),
	icon: z.string().min(1),
	translations: AmenityTranslationSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const AmenityComputedSchema = z.object({
	id: z.string().min(1),
	slug: z.string().min(1),
	icon: z.string().min(1),
	translations: AmenityTranslationSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Amenity = z.infer<typeof AmenitySchema>;

export const GetAmenityInputSchema = z.object({
	id: z.string(),
});

export const ListAmenitiesInputSchema = z.object({
	cursor: z.string().optional(),
	take: z.coerce.number().int().min(1).max(100).optional(),
});

export const UpsertAmenityInputSchema = z.object({
	slug: z.string().min(1),
	icon: z.string().min(1),
	translations: z.array(AmenityTranslationInputSchema).min(1),
});

export const UpsertAmenityComputedInputSchema = z.object({
	slug: z.string().min(1),
	icon: z.string().min(1),
	translations: AmenityTranslationSchema,
});

export const DeleteAmenityInputSchema = z.object({
	id: z.string().min(1),
});

export type GetAmenityInput = z.infer<typeof GetAmenityInputSchema>;
export type ListAmenitiesInput = z.infer<typeof ListAmenitiesInputSchema>;
export type AmenityComputed = z.infer<typeof AmenityComputedSchema>;
export type UpsertAmenityInput = z.infer<typeof UpsertAmenityInputSchema>;
export type UpsertAmenityComputedInput = z.infer<
	typeof UpsertAmenityComputedInputSchema
>;
export type DeleteAmenityInput = z.infer<typeof DeleteAmenityInputSchema>;
