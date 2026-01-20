import type { Hotel } from "@zanadeal/api/contracts";
import { createContext, useContext } from "react";

type HotelContextValue = {
	hotel: Hotel;
	// archiveHotel: () => Promise<void>;
	// deleteHotel: () => Promise<void>;
};

export const HotelContext = createContext<HotelContextValue>(
	{} as HotelContextValue,
);

export function HotelProvider({
	hotel,
	children,
}: {
	hotel: Hotel;
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
