import { uppercaseFirstLetter } from "@zanadeal/utils";
import {
	getCookie,
	getLocaleName,
	Locales,
	type LocalesValues,
} from "intlayer";
import { LOCALES_CONSTANTS } from "../constants/locale.constants";

export const getLanguages = (locale: LocalesValues) => [
	{
		code: Locales.FRENCH,
		label: uppercaseFirstLetter(getLocaleName(Locales.FRENCH, locale)),
		flag: "fi fi-fr",
	},
	{
		code: Locales.ENGLISH,
		label: uppercaseFirstLetter(getLocaleName(Locales.ENGLISH, locale)),
		flag: "fi fi-us",
	},
	{
		code: Locales.MALAGASY_MADAGASCAR,
		label: uppercaseFirstLetter(
			getLocaleName(Locales.MALAGASY_MADAGASCAR, locale),
		),
		flag: "fi fi-mg",
	},
];

export const isLocaleValid = (locale: string | null | undefined): boolean => {
	if (!locale) return false;

	return Object.values(Locales).includes(locale as unknown as typeof Locales);
};

export const getLocale = () => {
	const localeFromCookie = getCookie(LOCALES_CONSTANTS.localeCookieKey);

	let locale: LocalesValues = Locales.ENGLISH; // Default locale

	if (isLocaleValid(localeFromCookie)) {
		locale = localeFromCookie as LocalesValues;
	}

	return locale;
};
