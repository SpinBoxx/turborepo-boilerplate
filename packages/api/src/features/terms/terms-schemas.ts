import * as z from "zod";

export const TermsTypeSchema = z.enum(["CGU", "CGV", "PRIVACY_POLICY"]);

export const TermsSchema = z.object({
	id: z.string().min(1),
	type: TermsTypeSchema,
	content: z.string().min(1),
	version: z.string().min(1),
	createdAt: z.date(),
});

export type Terms = z.infer<typeof TermsSchema>;
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

export const CreateTermsInputSchema = z.object({
	type: TermsTypeSchema,
	content: z.string().min(1),
	version: z.string().min(1),
});

export const UpdateTermsInputSchema = z.object({
	id: z.string().min(1),
	type: TermsTypeSchema.optional(),
	content: z.string().min(1).optional(),
	version: z.string().min(1).optional(),
});

export const DeleteTermsInputSchema = z.object({
	id: z.string().min(1),
});

export type CreateTermsInput = z.infer<typeof CreateTermsInputSchema>;
export type GetTermsInput = z.infer<typeof GetTermsInputSchema>;
export type ListTermsInput = z.infer<typeof ListTermsInputSchema>;
export type UpdateTermsInput = z.infer<typeof UpdateTermsInputSchema>;
export type DeleteTermsInput = z.infer<typeof DeleteTermsInputSchema>;
