import { LOCALES } from "@zanadeal/api/constants";

import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useState,
} from "react";

export type LocaleContext = {
	locale: (typeof LOCALES)[number];
	locales: readonly (typeof LOCALES)[number][];
	setlocale: Dispatch<React.SetStateAction<(typeof LOCALES)[number]>>;
};

export const LocaleProviderContext = createContext<LocaleContext>(
	{} as LocaleContext,
);

export const useLocaleContext = () => useContext(LocaleProviderContext);

export default function LocaleProvider({
	children,
}: {
	children: ReactNode | ((context: LocaleContext) => ReactNode);
}) {
	const DEAFAULT_LOCALE = LOCALES[0];
	const [locale, setlocale] =
		useState<(typeof LOCALES)[number]>(DEAFAULT_LOCALE);

	const contextValue = {
		locales: LOCALES,
		locale,
		setlocale,
	};

	return (
		<LocaleProviderContext.Provider value={contextValue}>
			{typeof children === "function" ? children(contextValue) : children}
		</LocaleProviderContext.Provider>
	);
}
