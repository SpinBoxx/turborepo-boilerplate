import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
	internationalization: {
		locales: [Locales.FRENCH, Locales.ENGLISH, Locales.MALAGASY_MADAGASCAR],
		defaultLocale: Locales.FRENCH,
		requiredLocales: [Locales.FRENCH, Locales.ENGLISH],
	},
	compiler: {
		enabled: true,
	},
	content: {
		watch: true,
	},
};

export default config;
