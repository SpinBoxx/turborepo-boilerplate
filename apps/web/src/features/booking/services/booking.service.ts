import { dateToString, stringToDate } from "@zanadeal/utils";
import { addDays, isBefore, isValid } from "date-fns";

export type BookingDates = {
	checkInDate: string;
	checkOutDate: string;
};

// After this hour, same-day check-in is no longer allowed.
export const NO_BOOKING_AFTER_HOURS = 17;

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isDateOnlyString(value: string): boolean {
	if (!DATE_ONLY_PATTERN.test(value)) {
		return false;
	}

	return isValid(stringToDate(value));
}

export function getBookingCutoffTime(
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): Date {
	// Keep the comparison in the user's local timezone by deriving the cutoff
	// from the same local Date instance used for the current time.
	const cutoffTime = new Date(now);
	cutoffTime.setHours(cutoffHour, 0, 0, 0);
	return cutoffTime;
}

export function canBookForToday(
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): boolean {
	return isBefore(now, getBookingCutoffTime(now, cutoffHour));
}

export function getNextBookableDate(
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): Date {
	// The calendar needs a Date instance so it can disable every day before the
	// first day that is still bookable.
	return canBookForToday(now, cutoffHour) ? new Date(now) : addDays(now, 1);
}

export function getEarliestBookableCheckInDate(
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): string {
	return dateToString(getNextBookableDate(now, cutoffHour));
}

export function createBookingDatesFromCheckIn(
	checkInDate: string,
): BookingDates {
	return {
		checkInDate,
		checkOutDate: dateToString(addDays(stringToDate(checkInDate), 1)),
	};
}

export function getDefaultBookingDates(
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): BookingDates {
	return createBookingDatesFromCheckIn(
		getEarliestBookableCheckInDate(now, cutoffHour),
	);
}

export function isCheckInBeforeMinimumAllowed(
	checkInDate: string,
	minimumCheckInDate: string,
): boolean {
	return checkInDate < minimumCheckInDate;
}

export function isCheckoutAfterCheckIn(
	checkInDate: string,
	checkOutDate: string,
): boolean {
	if (!isDateOnlyString(checkInDate) || !isDateOnlyString(checkOutDate)) {
		return false;
	}

	return checkOutDate > checkInDate;
}

export function shouldRefreshBookingDates(
	dates: BookingDates,
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): boolean {
	// Persisted dates must be refreshed if they are invalid, in the past relative
	// to the current booking window, or if the checkout is no longer coherent.
	const minimumCheckInDate = getEarliestBookableCheckInDate(now, cutoffHour);

	if (
		!isDateOnlyString(dates.checkInDate) ||
		!isDateOnlyString(dates.checkOutDate)
	) {
		return true;
	}

	if (isCheckInBeforeMinimumAllowed(dates.checkInDate, minimumCheckInDate)) {
		return true;
	}

	return !isCheckoutAfterCheckIn(dates.checkInDate, dates.checkOutDate);
}

export function normalizeBookingDates(
	dates: BookingDates,
	now: Date = new Date(),
	cutoffHour: number = NO_BOOKING_AFTER_HOURS,
): BookingDates {
	const minimumCheckInDate = getEarliestBookableCheckInDate(now, cutoffHour);

	if (
		!isDateOnlyString(dates.checkInDate) ||
		isCheckInBeforeMinimumAllowed(dates.checkInDate, minimumCheckInDate)
	) {
		// A stale or invalid check-in is fully reset to the earliest bookable window.
		return getDefaultBookingDates(now, cutoffHour);
	}

	if (!isCheckoutAfterCheckIn(dates.checkInDate, dates.checkOutDate)) {
		// If the check-in is still valid, keep it and only rebuild the checkout.
		return createBookingDatesFromCheckIn(dates.checkInDate);
	}

	return dates;
}
