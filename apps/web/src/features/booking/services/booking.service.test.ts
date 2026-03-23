import { describe, expect, it } from "vitest";
import {
	canBookForToday,
	createBookingDatesFromCheckIn,
	getBookingCutoffTime,
	getDefaultBookingDates,
	getEarliestBookableCheckInDate,
	getNextBookableDate,
	isCheckInBeforeMinimumAllowed,
	isCheckoutAfterCheckIn,
	isDateOnlyString,
	normalizeBookingDates,
	shouldRefreshBookingDates,
} from "./booking.service";

describe("booking.service", () => {
	it("valide un format de date-only correct", () => {
		expect(isDateOnlyString("2026-03-23")).toBe(true);
		expect(isDateOnlyString("2026-02-30")).toBe(false);
		expect(isDateOnlyString("23-03-2026")).toBe(false);
	});

	it("calcule l'heure de cutoff du jour courant", () => {
		const now = new Date(2026, 2, 23, 9, 15, 44, 123);
		const cutoff = getBookingCutoffTime(now, 17);

		expect(cutoff.getFullYear()).toBe(2026);
		expect(cutoff.getMonth()).toBe(2);
		expect(cutoff.getDate()).toBe(23);
		expect(cutoff.getHours()).toBe(17);
		expect(cutoff.getMinutes()).toBe(0);
		expect(cutoff.getSeconds()).toBe(0);
		expect(cutoff.getMilliseconds()).toBe(0);
	});

	it("autorise la réservation du jour avant le cutoff seulement", () => {
		expect(canBookForToday(new Date(2026, 2, 23, 16, 59), 17)).toBe(true);
		expect(canBookForToday(new Date(2026, 2, 23, 17, 0), 17)).toBe(false);
		expect(canBookForToday(new Date(2026, 2, 23, 18, 30), 17)).toBe(false);
	});

	it("détermine la première date de check-in autorisée", () => {
		expect(
			getEarliestBookableCheckInDate(new Date(2026, 2, 23, 10, 0), 17),
		).toBe("2026-03-23");
		expect(
			getEarliestBookableCheckInDate(new Date(2026, 2, 23, 17, 0), 17),
		).toBe("2026-03-24");
	});

	it("retourne la prochaine date réservable au format Date", () => {
		const beforeCutoff = getNextBookableDate(new Date(2026, 2, 23, 10, 0), 17);
		const afterCutoff = getNextBookableDate(new Date(2026, 2, 23, 18, 0), 17);

		expect(beforeCutoff).toBeInstanceOf(Date);
		expect(beforeCutoff.getFullYear()).toBe(2026);
		expect(beforeCutoff.getMonth()).toBe(2);
		expect(beforeCutoff.getDate()).toBe(23);

		expect(afterCutoff).toBeInstanceOf(Date);
		expect(afterCutoff.getFullYear()).toBe(2026);
		expect(afterCutoff.getMonth()).toBe(2);
		expect(afterCutoff.getDate()).toBe(24);
	});

	it("crée des dates de réservation cohérentes depuis un check-in", () => {
		expect(createBookingDatesFromCheckIn("2026-03-24")).toEqual({
			checkInDate: "2026-03-24",
			checkOutDate: "2026-03-25",
		});
	});

	it("retourne les dates par défaut selon le cutoff", () => {
		expect(getDefaultBookingDates(new Date(2026, 2, 23, 11, 0), 17)).toEqual({
			checkInDate: "2026-03-23",
			checkOutDate: "2026-03-24",
		});

		expect(getDefaultBookingDates(new Date(2026, 2, 23, 17, 30), 17)).toEqual({
			checkInDate: "2026-03-24",
			checkOutDate: "2026-03-25",
		});
	});

	it("compare correctement le minimum autorisé de check-in", () => {
		expect(isCheckInBeforeMinimumAllowed("2026-03-22", "2026-03-23")).toBe(
			true,
		);
		expect(isCheckInBeforeMinimumAllowed("2026-03-23", "2026-03-23")).toBe(
			false,
		);
	});

	it("valide que le checkout est strictement après le checkin", () => {
		expect(isCheckoutAfterCheckIn("2026-03-23", "2026-03-24")).toBe(true);
		expect(isCheckoutAfterCheckIn("2026-03-23", "2026-03-23")).toBe(false);
		expect(isCheckoutAfterCheckIn("bad-date", "2026-03-24")).toBe(false);
	});

	it("détecte quand une réservation persistée doit être rafraîchie", () => {
		const beforeCutoff = new Date(2026, 2, 23, 12, 0);
		const afterCutoff = new Date(2026, 2, 23, 18, 0);

		expect(
			shouldRefreshBookingDates(
				{ checkInDate: "2026-03-23", checkOutDate: "2026-03-24" },
				beforeCutoff,
				17,
			),
		).toBe(false);

		expect(
			shouldRefreshBookingDates(
				{ checkInDate: "2026-03-22", checkOutDate: "2026-03-23" },
				beforeCutoff,
				17,
			),
		).toBe(true);

		expect(
			shouldRefreshBookingDates(
				{ checkInDate: "2026-03-23", checkOutDate: "2026-03-24" },
				afterCutoff,
				17,
			),
		).toBe(true);

		expect(
			shouldRefreshBookingDates(
				{ checkInDate: "2026-03-25", checkOutDate: "2026-03-25" },
				beforeCutoff,
				17,
			),
		).toBe(true);
	});

	it("normalise une réservation passée avant le cutoff vers aujourd'hui", () => {
		expect(
			normalizeBookingDates(
				{ checkInDate: "2026-03-22", checkOutDate: "2026-03-23" },
				new Date(2026, 2, 23, 12, 0),
				17,
			),
		).toEqual({
			checkInDate: "2026-03-23",
			checkOutDate: "2026-03-24",
		});
	});

	it("normalise une réservation passée après le cutoff vers demain", () => {
		expect(
			normalizeBookingDates(
				{ checkInDate: "2026-03-22", checkOutDate: "2026-03-23" },
				new Date(2026, 2, 23, 18, 0),
				17,
			),
		).toEqual({
			checkInDate: "2026-03-24",
			checkOutDate: "2026-03-25",
		});
	});

	it("déplace un check-in du jour après cutoff vers demain", () => {
		expect(
			normalizeBookingDates(
				{ checkInDate: "2026-03-23", checkOutDate: "2026-03-24" },
				new Date(2026, 2, 23, 17, 0),
				17,
			),
		).toEqual({
			checkInDate: "2026-03-24",
			checkOutDate: "2026-03-25",
		});
	});

	it("corrige seulement le checkout quand le checkin futur reste valide", () => {
		expect(
			normalizeBookingDates(
				{ checkInDate: "2026-03-26", checkOutDate: "2026-03-26" },
				new Date(2026, 2, 23, 12, 0),
				17,
			),
		).toEqual({
			checkInDate: "2026-03-26",
			checkOutDate: "2026-03-27",
		});
	});
});
