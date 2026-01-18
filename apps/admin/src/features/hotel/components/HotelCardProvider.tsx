import type { Hotel } from "@zanadeal/api/contracts";
import { createContext, useContext, useMemo } from "react";

type HotelCardContextValue = {
	hotel: Hotel;
	onEdit?: (hotel: Hotel) => void;
	onDelete?: (hotel: Hotel) => void;
};

const HotelCardContext = createContext<HotelCardContextValue | null>(null);

export function HotelCardProvider({
	hotel,
	onEdit,
	onDelete,
	children,
}: {
	hotel: Hotel;
	onEdit?: (hotel: Hotel) => void;
	onDelete?: (hotel: Hotel) => void;
	children: React.ReactNode;
}) {
	const value = useMemo<HotelCardContextValue>(() => {
		return {
			hotel,
			onEdit,
			onDelete,
		};
	}, [hotel, onEdit, onDelete]);

	return (
		<HotelCardContext.Provider value={value}>
			{children}
		</HotelCardContext.Provider>
	);
}

export function useHotelCard() {
	const ctx = useContext(HotelCardContext);
	if (!ctx) {
		throw new Error("useHotelCard must be used within <HotelCardProvider>");
	}
	return ctx;
}
