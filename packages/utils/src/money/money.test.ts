import { describe, expect, it } from "vitest";
import { getNightlyBreakdown, getTotalPriceByRange } from "./money";

// Helper: create a UTC date at midnight for a given YYYY-MM-DD string
const d = (dateStr: string) => new Date(`${dateStr}T00:00:00.000Z`);

// Helper: simulate stored dates with T22:00 (Madagascar timezone offset)
const dMG = (dateStr: string) => new Date(`${dateStr}T22:00:00.000Z`);

describe("getNightlyBreakdown", () => {
	it("returns one entry per night between check-in and check-out", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-12") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-11"),
		);

		expect(breakdown).toHaveLength(3);
		expect(breakdown.map((b) => b.price)).toEqual([100, 100, 100]);
	});

	it("returns 0 nights for same check-in and check-out", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-12") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-08"),
		);

		expect(breakdown).toHaveLength(0);
	});

	it("returns 1 night for consecutive days", () => {
		const prices = [
			{ price: 150, startDate: d("2026-04-08"), endDate: d("2026-04-09") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-09"),
		);

		expect(breakdown).toHaveLength(1);
		expect(breakdown[0]?.price).toBe(150);
	});

	it("picks the correct price per night from multiple ranges", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-10") },
			{ price: 200, startDate: d("2026-04-11"), endDate: d("2026-04-13") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-13"),
		);

		expect(breakdown).toHaveLength(5);
		expect(breakdown.map((b) => b.price)).toEqual([100, 100, 100, 200, 200]);
	});

	it("returns price 0 for nights with no matching range", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-09") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-11"),
		);

		expect(breakdown).toHaveLength(3);
		expect(breakdown.map((b) => b.price)).toEqual([100, 100, 0]);
	});

	it("handles UTC+3 stored dates (T22:00Z) correctly", () => {
		// This is the actual bug scenario:
		// Price range stored as 2026-04-07T22:00Z to 2026-04-10T22:00Z
		// represents April 8 to April 11 in local time
		// Guest stays April 8 to April 12 (4 nights)
		const prices = [
			{ price: 200, startDate: dMG("2026-04-07"), endDate: dMG("2026-04-10") },
		];

		// Check-in/out also stored as T22:00Z
		const breakdown = getNightlyBreakdown(
			prices,
			dMG("2026-04-07"),
			dMG("2026-04-11"),
		);

		// 4 nights: April 8, 9, 10, 11 (local)
		expect(breakdown).toHaveLength(4);
		// The last night (April 10T22:00Z = April 11 local) should still find
		// a price since it falls on the boundary of the range endDate
		expect(breakdown.map((b) => b.price)).toEqual([200, 200, 200, 200]);
	});

	it("handles mixed date formats: date-only check-in with UTC+3 price ranges", () => {
		// When dates have inconsistent timezone representations (date-only strings
		// parsed as UTC midnight vs API timestamps with timezone offset),
		// the last night can fall outside the range. This is expected behavior —
		// callers must ensure dates are in a consistent timezone representation.
		const prices = [
			{ price: 200, startDate: dMG("2026-04-07"), endDate: dMG("2026-04-10") },
		];

		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-12"),
		);

		expect(breakdown).toHaveLength(4);
		// Night 4 (April 11 00:00Z) > endDate (April 10 22:00Z) → price 0
		// This documents the limitation — fix at caller by using consistent dates.
		expect(breakdown.map((b) => b.price)).toEqual([200, 200, 200, 0]);
	});

	it("handles boundary: night date equals range endDate", () => {
		// Range: April 8 00:00Z to April 10 00:00Z (endDate inclusive)
		// Stay: April 8 to April 11 (3 nights)
		// Night of April 10 should match since currentDate (April 10) <= endDate (April 10)
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-10") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-11"),
		);

		expect(breakdown).toHaveLength(3);
		expect(breakdown.map((b) => b.price)).toEqual([100, 100, 100]);
	});

	it("handles multiple non-contiguous ranges with a gap", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-09") },
			{ price: 300, startDate: d("2026-04-11"), endDate: d("2026-04-12") },
		];
		const breakdown = getNightlyBreakdown(
			prices,
			d("2026-04-08"),
			d("2026-04-13"),
		);

		expect(breakdown).toHaveLength(5);
		// April 8=100, 9=100, 10=0 (gap), 11=300, 12=300
		expect(breakdown.map((b) => b.price)).toEqual([100, 100, 0, 300, 300]);
	});
});

describe("getTotalPriceByRange", () => {
	it("sums up all nightly prices", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-10") },
			{ price: 200, startDate: d("2026-04-11"), endDate: d("2026-04-12") },
		];
		const total = getTotalPriceByRange(
			prices,
			d("2026-04-08"),
			d("2026-04-13"),
		);

		// 3 nights × 100 + 2 nights × 200 = 700
		expect(total).toBe(700);
	});

	it("returns 0 for zero nights", () => {
		const prices = [
			{ price: 100, startDate: d("2026-04-08"), endDate: d("2026-04-12") },
		];
		const total = getTotalPriceByRange(
			prices,
			d("2026-04-08"),
			d("2026-04-08"),
		);

		expect(total).toBe(0);
	});

	it("returns correct total with UTC+3 stored dates", () => {
		const prices = [
			{ price: 200, startDate: dMG("2026-04-07"), endDate: dMG("2026-04-10") },
		];
		const total = getTotalPriceByRange(
			prices,
			dMG("2026-04-07"),
			dMG("2026-04-11"),
		);

		// 4 nights × 200 = 800
		expect(total).toBe(800);
	});
});
