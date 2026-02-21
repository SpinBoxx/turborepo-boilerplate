import * as z from "zod";
import { LOCALES } from "../../constants";

export const TermTranslationItemSchema = z.object({
	content: z.string(),
});

export const TermTranslationSchema = z.partialRecord(
	z.enum(LOCALES),
	TermTranslationItemSchema,
);

export const TermTranslationInputSchema = z.object({
	locale: z.enum(LOCALES),
	content: z.string().min(1),
});

export type TermTranslation = z.infer<typeof TermTranslationSchema>;
export type TermTranslationInput = z.infer<typeof TermTranslationInputSchema>;
