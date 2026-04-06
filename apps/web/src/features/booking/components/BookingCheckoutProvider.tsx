import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import type { RoomUserComputed } from "@zanadeal/api/features/room";
import {
	getNightlyBreakdown,
	type NightBreakdownItem,
	stringToDate,
} from "@zanadeal/utils";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useAuth } from "@/auth/providers/AuthProvider";

interface PricePreview {
	nights: number;
	subtotal: number;
	taxAmount: number;
	total: number;
	breakdown: NightBreakdownItem[];
}

export interface BookingCheckoutContext {
	room: RoomUserComputed;
	hotel: HotelUserComputed;
	checkInDate: string;
	checkOutDate: string;
	guestCount: number;
	pricePreview: PricePreview;
	canSubmit: boolean;
}

const BookingCheckoutProviderContext = createContext<BookingCheckoutContext>(
	{} as BookingCheckoutContext,
);

export const useBookingCheckoutContext = () =>
	useContext(BookingCheckoutProviderContext);

interface BookingCheckoutProviderProps {
	room: RoomUserComputed;
	hotel: HotelUserComputed;
	checkInDate: string;
	checkOutDate: string;
	guestCount: number;
	children: ReactNode;
}

export default function BookingCheckoutProvider({
	room,
	hotel,
	checkInDate,
	checkOutDate,
	guestCount,
	children,
}: BookingCheckoutProviderProps) {
	const { user } = useAuth();

	const pricePreview = useMemo(() => {
		// Use stringToDate (parseISO) instead of new Date() to parse date-only
		// strings in local timezone, matching the API price dates convention.
		const checkIn = stringToDate(checkInDate);
		const checkOut = stringToDate(checkOutDate);
		const breakdown = getNightlyBreakdown(
			room.prices.map((p) => ({
				price: p.price,
				startDate: new Date(p.startDate),
				endDate: new Date(p.endDate),
			})),
			checkIn,
			checkOut,
		);
		const nights = breakdown.length;
		const subtotal = breakdown.reduce((sum, n) => sum + n.price, 0);
		const taxAmount = 0;
		const total = subtotal + taxAmount;

		return { nights, subtotal, taxAmount, total, breakdown };
	}, [room.prices, checkInDate, checkOutDate]);

	const contextValue: BookingCheckoutContext = {
		room,
		canSubmit: !!user,
		hotel,
		checkInDate,
		checkOutDate,
		guestCount,
		pricePreview,
	};

	return (
		<BookingCheckoutProviderContext.Provider value={contextValue}>
			{children}
		</BookingCheckoutProviderContext.Provider>
	);
}
