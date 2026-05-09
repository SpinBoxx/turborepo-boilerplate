import type { HotelComputed } from "@zanadeal/api/features/hotel";

import { createContext, type ReactNode, useContext } from "react";

export interface HotelAppliedBookingDates {
	checkInDate: string;
	checkOutDate: string;
}

export type HotelContext = {
	appliedBookingDates?: HotelAppliedBookingDates;
	hotel: HotelComputed;
};

export const HotelProviderContext = createContext<HotelContext>(
	{} as HotelContext,
);

export const useHotelContext = () => useContext(HotelProviderContext);

export default function HotelProvider({
	appliedBookingDates,
	hotel,
	children,
}: {
	appliedBookingDates?: HotelAppliedBookingDates;
	children: ReactNode | ((context: HotelContext) => ReactNode);
	hotel: HotelComputed;
}) {
	const contextValue = {
		appliedBookingDates,
		hotel,
	};

	return (
		<HotelProviderContext.Provider value={contextValue}>
			{typeof children === "function" ? children(contextValue) : children}
		</HotelProviderContext.Provider>
	);
}
