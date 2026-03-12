import {
	dateToString,
	getNights,
	todayDateOnly,
	tomorrowDateOnly,
} from "@zanadeal/utils";
import { create } from "zustand";

interface BookingState {
	// Guest count management
	guestCount: number;
	maxGuests: number;

	// Booking details
	checkInDate: string;
	checkOutDate: string;
	roomId: string | null;

	// Actions for guest count
	increaseGuests: () => void;
	decreaseGuests: () => void;
	setMaxGuests: (max: number) => void;
	setShowAddGuestForm: (show: boolean) => void;

	// Actions for booking details
	getNights: () => number;
	setCheckInDate: (date: Date) => void;
	setCheckOutDate: (date: Date) => void;
	setRoomId: (roomId: string | null) => void;

	// Utility actions
	resetBooking: () => void;
	hasGuest: () => boolean;
	hasAllInfo: () => boolean;
	hasMaxGuests: () => boolean;
}

const DEFAULT_MAX_GUESTS = 6;

export const useBookingStore = create<BookingState>()((set, get) => ({
	// Initial state
	guestCount: 1,
	maxGuests: DEFAULT_MAX_GUESTS,
	checkInDate: todayDateOnly(),
	checkOutDate: tomorrowDateOnly(),
	roomId: null,

	// Guest count actions
	increaseGuests: () =>
		set((state) => ({
			guestCount:
				state.guestCount < state.maxGuests
					? state.guestCount + 1
					: state.guestCount,
		})),

	setShowAddGuestForm: (_show: boolean) => {},
	decreaseGuests: () =>
		set((state) => ({
			guestCount:
				state.guestCount > 1 ? state.guestCount - 1 : state.guestCount,
		})),

	setMaxGuests: (max: number) =>
		set((state) => ({
			maxGuests: Math.max(1, max),
			guestCount: Math.min(state.guestCount, max),
		})),

	// Booking details actions
	setCheckInDate: (date: Date) => {
		set({ checkInDate: dateToString(date) });
	},
	setCheckOutDate: (date: Date) => {
		set({ checkOutDate: dateToString(date) });
	},

	setRoomId: (roomId: string | null) => set({ roomId }),

	getNights: () => {
		const { checkInDate, checkOutDate } = get();
		return getNights(checkInDate, checkOutDate);
	},

	// Utility actions
	resetBooking: () =>
		set({
			guestCount: 1,
			checkInDate: todayDateOnly(),
			checkOutDate: tomorrowDateOnly(),
			roomId: null,
		}),

	hasGuest: () => {
		const state = get();
		return state.guestCount > 0;
	},

	hasMaxGuests: () => {
		const state = get();
		return state.guestCount >= state.maxGuests;
	},

	hasAllInfo: () => {
		const state = get();

		return !!(state.checkInDate && state.checkOutDate);
	},
}));
