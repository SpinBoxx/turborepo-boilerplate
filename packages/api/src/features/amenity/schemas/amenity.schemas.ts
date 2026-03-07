import * as z from "zod";
import type { Amenity } from "../../../../../db/prisma/generated/client";
import { createListSchemaFor } from "../../../utils";
import {
	AmenityTranslationInputSchema,
	AmenityTranslationSchema,
} from "./amenity-translation.schemas";

export const AmenityComputedSchema = z.object({
	id: z.string().min(1),
	slug: z.string().min(1),
	icon: z.string().min(1),
	translations: AmenityTranslationSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const GetAmenityInputSchema = z.object({
	id: z.string(),
});

export const ListAmenitiesInputSchema = createListSchemaFor<Amenity>()({
	sort: {
		default: {
			direction: "desc",
			field: "createdAt",
		},
		fields: ["createdAt", "slug"],
	},
	filters: {
		createdAt: {
			schema: z.date(),
			operators: ["lt"],
		},
	},
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
