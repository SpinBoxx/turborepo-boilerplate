import { addDays, differenceInDays, format, parseISO } from "date-fns";

export function todayDateOnly() {
	return format(new Date(), "yyyy-MM-dd");
}

export function tomorrowDateOnly() {
	return format(addDays(new Date(), 1), "yyyy-MM-dd");
}

export function getNights(checkin: string, checkout: string) {
	const start = parseISO(checkin); // "2025-03-20"
	const end = parseISO(checkout); // "2025-03-22"

	return differenceInDays(end, start);
}

export function dateToString(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

export function stringToDate(value: string): Date {
	return parseISO(value);
}
