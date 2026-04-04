import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookingState = {};

const _DEFAULT_MAX_GUESTS = 6;

export const useBookingStore = create<BookingState>()(
	persist(
		(_set, _gett) => ({
			// Initial state
		}),
		{
			name: "zanadeal-cart",
			partialize: (state) => ({
				guestCount: state.guestCount,
				checkInDate: state.checkInDate,
				checkOutDate: state.checkOutDate,
				roomId: state.roomId,
			}),
		},
	),
);
