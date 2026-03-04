import * as z from "zod";
import { LOCALES } from "../../constants";

export const AmenityTranslationItemSchema = z.object({
	name: z.string().min(1),
});

export const AmenityTranslationSchema = z.partialRecord(
	z.enum(LOCALES),
	AmenityTranslationItemSchema,
);

export const AmenityTranslationInputSchema = z.object({
	locale: z.enum(LOCALES),
	name: z.string(),
});

export type AmenityTranslation = z.infer<typeof AmenityTranslationSchema>;
export type AmenityTranslationInput = z.infer<
	typeof AmenityTranslationInputSchema
>;
