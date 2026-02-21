import * as z from "zod";
import {
	TermTranslationInputSchema,
	TermTranslationSchema,
} from "./terms-translation.schemas";

export const TermsTypeSchema = z.enum(["CGU", "CGV", "PRIVACY_POLICY"]);

export const TermsSchema = z.object({
	id: z.string().min(1),
	type: TermsTypeSchema,
	translations: TermTranslationSchema,
	version: z.string().min(1),
	createdAt: z.date(),
});

export const TermsComputedSchema = z.object({
	id: z.string().min(1),
	type: TermsTypeSchema,
	translations: TermTranslationSchema,
	version: z.string().min(1),
	createdAt: z.date(),
});

export type Terms = z.infer<typeof TermsSchema>;
export type TermsComputed = z.infer<typeof TermsComputedSchema>;
export type TermsType = z.infer<typeof TermsTypeSchema>;

export const GetTermsInputSchema = z.object({
	id: z.string().min(1),
});

export const ListTermsInputSchema = z.object({
	cursor: z.string().optional(),
	take: z.coerce.number().int().min(1).max(100).optional(),
	// Optionnel: filtrer par type de termes (CGU/CGV/...)
	type: TermsTypeSchema.optional(),
	orderBy: z
		.object({
			createdAt: z.enum(["asc", "desc"]).optional(),
			version: z.enum(["asc", "desc"]).optional(),
		})
		.optional(),
});

export const UpsertTermsInputSchema = z.object({
	type: TermsTypeSchema,
	translations: z.array(TermTranslationInputSchema),
	version: z.string().min(1),
});

export const UpsertTermsComputedInputSchema = z.object({
	type: TermsTypeSchema,
	translations: TermTranslationSchema,
	version: z.string().min(1),
});

export const DeleteTermsInputSchema = z.object({
	id: z.string().min(1),
});

export type GetTermsInput = z.infer<typeof GetTermsInputSchema>;
export type ListTermsInput = z.infer<typeof ListTermsInputSchema>;
export type UpsertTermsInput = z.infer<typeof UpsertTermsInputSchema>;
export type UpsertTermsComputedInput = z.infer<
	typeof UpsertTermsComputedInputSchema
>;
export type DeleteTermsInput = z.infer<typeof DeleteTermsInputSchema>;
