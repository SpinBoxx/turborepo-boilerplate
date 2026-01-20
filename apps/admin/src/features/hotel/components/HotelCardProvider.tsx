import type { Hotel } from "@zanadeal/api/contracts";
import { createContext, useContext, useMemo } from "react";

type HotelCardContextValue = {
	hotel: Hotel;
};

const HotelCardContext = createContext<HotelCardContextValue | null>(null);

export function HotelCardProvider({
	hotel,
	children,
}: {
	hotel: Hotel;
	children: React.ReactNode;
}) {
	const value = useMemo<HotelCardContextValue>(() => {
		return {
			hotel,
		};
	}, [hotel]);

	return (
		<HotelCardContext.Provider value={value}>
			{children}
		</HotelCardContext.Provider>
	);
}

export function useHotelContext() {
	const ctx = useContext(HotelCardContext);
	if (!ctx) {
		throw new Error("useHotelContext must be used within <HotelCardProvider>");
	}
	return ctx;
}
