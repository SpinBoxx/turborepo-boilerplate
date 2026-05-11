import { type IntlayerConfig, Locales } from "intlayer";

const config: IntlayerConfig = {
	internationalization: {
		locales: [Locales.FRENCH, Locales.ENGLISH, Locales.MALAGASY_MADAGASCAR],
		defaultLocale: Locales.ENGLISH,
		requiredLocales: [Locales.FRENCH, Locales.ENGLISH],
	},
	routing: {
		storage: ["localStorage"],
	},
	compiler: {
		enabled: false,
		output: ({ fileName }) => `./${fileName}.content.ts`,
	},

	content: {
		watch: true,
	},
};

export default config;
