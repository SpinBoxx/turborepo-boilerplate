import {
	dateToString,
	getNights,
	todayDateOnly,
	tomorrowDateOnly,
} from "@zanadeal/utils";
import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	createBookingDatesFromCheckIn,
	getDefaultBookingDates,
	getEarliestBookableCheckInDate,
	isCheckInBeforeMinimumAllowed,
	isCheckoutAfterCheckIn,
	isDateOnlyString,
	normalizeBookingDates,
	shouldRefreshBookingDates,
} from "../services/booking.service";

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
	validateBooking: () => {
		success: boolean;
		error?: string;
	};
	refreshBooking: () => void;
	resetBooking: (when?: "today" | "tomorrow") => void;
	hasGuest: () => boolean;
	hasAllInfo: () => boolean;
	hasMaxGuests: () => boolean;
}

const DEFAULT_MAX_GUESTS = 6;

export const useBookingStore = create<BookingState>()(
	persist(
		(set, get) => ({
			// Initial state
			guestCount: 1,
			maxGuests: DEFAULT_MAX_GUESTS,
			...getDefaultBookingDates(),
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
			resetBooking: (when: "today" | "tomorrow" = "today") =>
				set({
					guestCount: 1,
					...createBookingDatesFromCheckIn(
						when === "tomorrow" ? tomorrowDateOnly() : todayDateOnly(),
					),
					roomId: null,
				}),
			refreshBooking: () => {
				const state = get();
				const currentDates = {
					checkInDate: state.checkInDate,
					checkOutDate: state.checkOutDate,
				};

				if (!shouldRefreshBookingDates(currentDates)) {
					return;
				}

				const nextDates = normalizeBookingDates(currentDates);

				set({
					...nextDates,
					roomId: null,
				});
			},

			hasGuest: () => {
				const state = get();
				return state.guestCount > 0;
			},

			hasMaxGuests: () => {
				const state = get();
				return state.guestCount >= state.maxGuests;
			},
			validateBooking: () => {
				const state = get();
				const minimumCheckInDate = getEarliestBookableCheckInDate();

				const bookingSchema = z.object({
					checkInDate: z.string().refine((date) => {
						return (
							isDateOnlyString(date) &&
							!isCheckInBeforeMinimumAllowed(date, minimumCheckInDate)
						);
					}, "Check-in date is no longer available"),

					checkOutDate: z.string().refine((date) => {
						return isCheckoutAfterCheckIn(state.checkInDate, date);
					}, "Check-out date must be after check-in date"),

					guestCount: z.number().min(1, "At least one guest is required"),
				});

				const result = bookingSchema.safeParse({
					checkInDate: state.checkInDate,
					checkOutDate: state.checkOutDate,
					guestCount: state.guestCount,
				});

				return {
					success: result.success,
					error: result.success ? undefined : result.error.issues[0]?.message,
				};
			},

			hasAllInfo: () => {
				const state = get();

				return !!(state.checkInDate && state.checkOutDate);
			},
		}),
		{
			name: "booking-store",
			partialize: (state) => ({
				guestCount: state.guestCount,
				checkInDate: state.checkInDate,
				checkOutDate: state.checkOutDate,
				roomId: state.roomId,
			}),
		},
	),
);
