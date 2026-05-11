import { addDays, differenceInDays, format, parseISO } from "date-fns";

export function todayDateOnly() {
	return format(new Date(), "yyyy-MM-dd");
}

export function tomorrowDateOnly() {
	return format(addDays(new Date(), 1), "yyyy-MM-dd");
}

export function addDaysDateOnly(days: number) {
	return format(addDays(new Date(), days), "yyyy-MM-dd");
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

/**
 * Returns `true` when every night in [rangeStart, rangeEnd) is covered by at
 * least one interval.  Follows the same day-by-day iteration pattern used by
 * `getTotalPriceByRange`.
 *
 * `endDate: null` on an interval means "open-ended" (always valid).
 */
export function hasFullDateCoverage(
	intervals: { startDate: Date; endDate: Date | null }[],
	rangeStart: Date,
	rangeEnd: Date,
): boolean {
	const dayMs = 24 * 60 * 60 * 1000;
	const totalNights = Math.round(
		(rangeEnd.getTime() - rangeStart.getTime()) / dayMs,
	);

	if (totalNights <= 0) return false;

	for (let i = 0; i < totalNights; i++) {
		const currentDate = new Date(rangeStart.getTime() + i * dayMs);
		const hasCoverage = intervals.some((interval) => {
			const afterStart = currentDate >= interval.startDate;
			const beforeEnd = !interval.endDate || currentDate <= interval.endDate;
			return afterStart && beforeEnd;
		});
		if (!hasCoverage) return false;
	}

	return true;
}
