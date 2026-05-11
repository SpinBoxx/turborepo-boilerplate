export const LOCALES = ["fr", "en", "mg"] as const;

export type Locale = (typeof LOCALES)[number];

export const verifyLocale = (locale: string | null | undefined): Locale => {
	if (!LOCALES.includes(locale as Locale)) {
		return "en";
	}

	return locale as Locale;
};
