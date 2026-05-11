import { uppercaseFirstLetter } from "@zanadeal/utils";
import {
	defaultLocale,
	getLocaleFromStorage,
	getLocaleName,
	Locales,
	type LocalesValues,
	locales,
	setLocaleInStorage,
} from "intlayer";

const localeFlags: Partial<Record<LocalesValues, string>> = {
	[Locales.FRENCH]: "fi fi-fr",
	[Locales.ENGLISH]: "fi fi-us",
	[Locales.MALAGASY_MADAGASCAR]: "fi fi-mg",
};

const browserStorageOptions = {
	getLocaleStorage: (name: string) => window.localStorage.getItem(name),
	setLocaleStorage: (name: string, value: string) =>
		window.localStorage.setItem(name, value),
	getSessionStorage: (name: string) => window.sessionStorage.getItem(name),
	setSessionStorage: (name: string, value: string) =>
		window.sessionStorage.setItem(name, value),
};

export const getLanguages = (locale: LocalesValues) =>
	locales.map((code) => ({
		code: code as LocalesValues,
		label: uppercaseFirstLetter(getLocaleName(code, locale)),
		flag: localeFlags[code as LocalesValues],
	}));

export const isLocaleValid = (
	locale: string | null | undefined,
): locale is LocalesValues => {
	if (!locale) return false;

	return locales.includes(locale as (typeof locales)[number]);
};

export const getStoredLocale = (): LocalesValues | undefined => {
	if (typeof window === "undefined") return undefined;

	const locale = getLocaleFromStorage(browserStorageOptions);

	return isLocaleValid(locale) ? locale : undefined;
};

export const storeLocale = (locale: LocalesValues) => {
	if (!isLocaleValid(locale) || typeof window === "undefined") return;

	try {
		setLocaleInStorage(locale, browserStorageOptions);
	} catch {
		return;
	}
};

export const getLocale = () => {
	return getStoredLocale() ?? (defaultLocale as LocalesValues);
};
