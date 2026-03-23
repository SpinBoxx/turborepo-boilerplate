import * as z from "zod";
import type { Terms as DbTerms } from "../../../../../db/prisma/generated/client";
import { createListSchemaFor } from "../../../utils";
import {
	TermTranslationInputSchema,
	TermTranslationSchema,
} from "../terms-translation.schemas";

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

export const ListTermsInputSchema = createListSchemaFor<DbTerms>()({
	sort: {
		default: {
			direction: "desc",
			field: "version",
		},
		fields: ["version", "createdAt"],
	},
	filters: {
		type: {
			schema: TermsTypeSchema,
			operators: ["equal"],
		},
		version: {
			schema: z.string().min(1),
			operators: ["equal", "contains"],
		},
	},
});

export const UpsertTermsInputSchema = z.object({
	type: TermsTypeSchema,
	translations: z.array(TermTranslationInputSchema),
	version: z.string().min(1),
});

export const CreateTermsInputSchema = UpsertTermsInputSchema;

export const UpsertTermsComputedInputSchema = z.object({
	type: TermsTypeSchema,
	translations: TermTranslationSchema,
	version: z.string().min(1),
});

export const DeleteTermsInputSchema = z.object({
	id: z.string().min(1),
});

export const UpdateTermsInputSchema = z.intersection(
	GetTermsInputSchema,
	UpsertTermsInputSchema.partial(),
);

export type GetTermsInput = z.infer<typeof GetTermsInputSchema>;
export type ListTermsInput = z.infer<typeof ListTermsInputSchema>;
export type CreateTermsInput = z.infer<typeof CreateTermsInputSchema>;
export type UpsertTermsInput = z.infer<typeof UpsertTermsInputSchema>;
export type UpsertTermsComputedInput = z.infer<
	typeof UpsertTermsComputedInputSchema
>;
export type DeleteTermsInput = z.infer<typeof DeleteTermsInputSchema>;
export type UpdateTermsInput = z.infer<typeof UpdateTermsInputSchema>;
