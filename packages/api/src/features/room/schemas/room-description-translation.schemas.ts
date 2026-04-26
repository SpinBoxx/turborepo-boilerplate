import * as z from "zod";
import { LOCALES } from "../../../constants";

export const RoomDescriptionTranslationItemSchema = z.object({
	description: z.string().trim().min(1).max(4000),
});

export const RoomDescriptionTranslationSchema = z.record(
	z.enum(LOCALES),
	RoomDescriptionTranslationItemSchema,
);

export const RoomDescriptionTranslationInputSchema = z.object({
	locale: z.enum(LOCALES),
	description: z.string().trim().min(1).max(4000),
});

export const RoomDescriptionTranslationInputListSchema = z
	.array(RoomDescriptionTranslationInputSchema)
	.length(LOCALES.length)
	.superRefine((translations, context) => {
		const locales = new Set(translations.map((translation) => translation.locale));

		for (const locale of LOCALES) {
			if (!locales.has(locale)) {
				context.addIssue({
					code: "custom",
					message: `Missing ${locale} room description translation`,
				});
			}
		}

		if (locales.size !== translations.length) {
			context.addIssue({
				code: "custom",
				message: "Room description translations must use unique locales",
			});
		}
	});

export type RoomDescriptionTranslation = z.infer<
	typeof RoomDescriptionTranslationSchema
>;
export type RoomDescriptionTranslationInput = z.infer<
	typeof RoomDescriptionTranslationInputSchema
>;