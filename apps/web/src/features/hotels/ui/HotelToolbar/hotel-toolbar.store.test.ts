import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "./hotel-toolbar.options";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

function resetHotelToolbarStore() {
	useHotelToolbarStore.setState({
		total: 0,
		name: DEFAULT_HOTELS_PAGE_SEARCH.name,
		sort: DEFAULT_HOTELS_PAGE_SEARCH.sort,
		priceRange: {
			min: DEFAULT_HOTELS_PAGE_SEARCH.minPrice,
			max: DEFAULT_HOTELS_PAGE_SEARCH.maxPrice,
		},
		drawerOpen: false,
		drawerDismissDisabled: false,
		draftSort: DEFAULT_HOTELS_PAGE_SEARCH.sort,
		draftPriceRange: {
			min: DEFAULT_HOTELS_PAGE_SEARCH.minPrice,
			max: DEFAULT_HOTELS_PAGE_SEARCH.maxPrice,
		},
		onSearchChange: null,
	});
}

describe("hotel-toolbar.store", () => {
	beforeEach(() => {
		resetHotelToolbarStore();
	});

	it("keeps the drawer open while dismiss is disabled", () => {
		useHotelToolbarStore.getState().setDrawerOpen(true);
		useHotelToolbarStore.getState().setDrawerDismissDisabled(true);

		useHotelToolbarStore.getState().setDrawerOpen(false);

		expect(useHotelToolbarStore.getState().drawerOpen).toBe(true);

		useHotelToolbarStore.getState().setDrawerDismissDisabled(false);
		useHotelToolbarStore.getState().setDrawerOpen(false);

		expect(useHotelToolbarStore.getState().drawerOpen).toBe(false);
	});
});
