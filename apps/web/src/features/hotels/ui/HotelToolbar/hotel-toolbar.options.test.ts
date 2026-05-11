import { describe, expect, it } from "vitest";
import {
	applyBookingDatesToHotelsSearch,
	DEFAULT_HOTELS_PAGE_SEARCH,
} from "./hotel-toolbar.options";

describe("hotel-toolbar.options", () => {
	it("applies booking dates when hotel search has no date filters", () => {
		const search = applyBookingDatesToHotelsSearch(DEFAULT_HOTELS_PAGE_SEARCH, {
			checkInDate: "2026-05-20",
			checkOutDate: "2026-05-22",
		});

		expect(search.checkIn).toBe("2026-05-20");
		expect(search.checkOut).toBe("2026-05-22");
	});

	it("keeps explicit hotel search dates", () => {
		const search = applyBookingDatesToHotelsSearch(
			{
				...DEFAULT_HOTELS_PAGE_SEARCH,
				checkIn: "2026-06-01",
				checkOut: "2026-06-03",
			},
			{
				checkInDate: "2026-05-20",
				checkOutDate: "2026-05-22",
			},
		);

		expect(search.checkIn).toBe("2026-06-01");
		expect(search.checkOut).toBe("2026-06-03");
	});

	it("keeps the search unchanged when checkout is missing", () => {
		const search = applyBookingDatesToHotelsSearch(DEFAULT_HOTELS_PAGE_SEARCH, {
			checkInDate: "2026-05-20",
			checkOutDate: null,
		});

		expect(search).toBe(DEFAULT_HOTELS_PAGE_SEARCH);
	});
});
