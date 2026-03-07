import type { HotelComputed } from "@zanadeal/api/features/hotel";

import { createContext, type ReactNode, useContext } from "react";

export type HotelContext = {
	hotel: HotelComputed;
};

export const HotelProviderContext = createContext<HotelContext>(
	{} as HotelContext,
);

export const useHotelContext = () => useContext(HotelProviderContext);

export default function HotelProvider({
	hotel,
	children,
}: {
	children: ReactNode | ((context: HotelContext) => ReactNode);
	hotel: HotelComputed;
}) {
	const contextValue = {
		hotel,
	};

	return (
		<HotelProviderContext.Provider value={contextValue}>
			{typeof children === "function" ? children(contextValue) : children}
		</HotelProviderContext.Provider>
	);
}
