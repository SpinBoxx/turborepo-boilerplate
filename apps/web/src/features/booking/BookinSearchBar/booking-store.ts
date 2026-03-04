import { getNights, todayDateOnly, tomorrowDateOnly } from "@zanadeal/utils";
import { create } from "zustand";

interface BookingState {
	// Guest count management
	guestCount: number;
	maxGuests: number;

	// Guest information
	isShowAddGuestForm: boolean;

	// Booking details
	checkInDate: string;
	checkOutDate: string;
	roomId: string | null;

	// Actions for guest count
	increaseGuests: () => void;
	decreaseGuests: () => void;
	setGuestCount: (count: number) => void;
	setMaxGuests: (max: number) => void;
	setShowAddGuestForm: (show: boolean) => void;

	// Actions for booking details
	getNights: () => number;
	setCheckInDate: (date: string) => void;
	setCheckOutDate: (date: string) => void;
	setRoomId: (roomId: string | null) => void;

	// Utility actions
	resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()((set, get) => ({
	// Initial state
	guestCount: 1,
	maxGuests: 4,
	checkInDate: todayDateOnly(),
	checkOutDate: tomorrowDateOnly(),
	roomId: null,
	isShowAddGuestForm: false,

	// Guest count actions
	increaseGuests: () =>
		set((state) => ({
			guestCount:
				state.guestCount < state.maxGuests
					? state.guestCount + 1
					: state.guestCount,
		})),

	setShowAddGuestForm: (show: boolean) => set({ isShowAddGuestForm: show }),
	decreaseGuests: () =>
		set((state) => ({
			guestCount:
				state.guestCount > 1 ? state.guestCount - 1 : state.guestCount,
		})),

	setGuestCount: (count: number) =>
		set((state) => ({
			guestCount: Math.min(Math.max(1, count), state.maxGuests),
		})),

	setMaxGuests: (max: number) =>
		set((state) => ({
			maxGuests: Math.max(1, max),
			guestCount: Math.min(state.guestCount, max),
		})),

	// Booking details actions
	setCheckInDate: (date: string) => {
		set({ checkInDate: date });
	},
	setCheckOutDate: (date: string) => {
		set({ checkOutDate: date });
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
}));

// Legacy export for backward compatibility
export const useGuestNumberStore = useBookingStore;
