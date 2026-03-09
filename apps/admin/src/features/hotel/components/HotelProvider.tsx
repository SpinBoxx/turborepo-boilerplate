import type { HotelAdminComputed } from "@zanadeal/api/features/hotel";
import { createContext, useContext } from "react";

type HotelContextValue = {
	hotel: HotelAdminComputed;
};

export const HotelContext = createContext<HotelContextValue>(
	{} as HotelContextValue,
);

export function HotelProvider({
	hotel,
	children,
}: {
	hotel: HotelAdminComputed;
	children: React.ReactNode;
}) {
	const context = {
		hotel,
	};

	return (
		<HotelContext.Provider value={context}>{children}</HotelContext.Provider>
	);
}

export function useHotelContext() {
	const ctx = useContext(HotelContext);
	if (!ctx) {
		throw new Error("useHotelContext must be used within <HotelProvider>");
	}
	return ctx;
}
