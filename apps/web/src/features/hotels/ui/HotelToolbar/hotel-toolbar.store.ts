import { create } from "zustand";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import {
	DEFAULT_HOTELS_PAGE_SEARCH,
	type HotelPriceRange,
	type HotelSortValue,
	type HotelsPageSearch,
} from "./hotel-toolbar.options";

type SearchChangeHandler = (nextSearch: Partial<HotelsPageSearch>) => void;

interface InitializeHotelToolbarInput {
	search: HotelsPageSearch;
	total: number;
	onSearchChange: SearchChangeHandler;
}

interface HotelToolbarStore {
	total: number;
	name: string;
	sort: HotelSortValue;
	priceRange: HotelPriceRange;
	drawerOpen: boolean;
	drawerDismissDisabled: boolean;
	draftSort: HotelSortValue;
	draftPriceRange: HotelPriceRange;
	onSearchChange: SearchChangeHandler | null;
	initialize: (input: InitializeHotelToolbarInput) => void;
	setDrawerOpen: (open: boolean) => void;
	setDrawerDismissDisabled: (disabled: boolean) => void;
	setName: (name: string) => void;
	setSort: (sort: HotelSortValue) => void;
	setPriceRange: (priceRange: HotelPriceRange) => void;
	setDraftSort: (sort: HotelSortValue) => void;
	setDraftPriceRange: (priceRange: HotelPriceRange) => void;
	applyDraft: () => void;
	reset: () => void;
	hasActiveFilter: () => boolean;
}

function getDefaultPriceRange(): HotelPriceRange {
	return {
		min: DEFAULT_HOTELS_PAGE_SEARCH.minPrice,
		max: DEFAULT_HOTELS_PAGE_SEARCH.maxPrice,
	};
}

function getPriceRangeFromSearch(search: HotelsPageSearch): HotelPriceRange {
	return {
		min: search.minPrice,
		max: search.maxPrice,
	};
}

export const useHotelToolbarStore = create<HotelToolbarStore>()((set, get) => ({
	total: 0,
	name: DEFAULT_HOTELS_PAGE_SEARCH.name,
	sort: DEFAULT_HOTELS_PAGE_SEARCH.sort,
	priceRange: getDefaultPriceRange(),
	drawerOpen: false,
	drawerDismissDisabled: false,
	draftSort: DEFAULT_HOTELS_PAGE_SEARCH.sort,
	draftPriceRange: getDefaultPriceRange(),
	onSearchChange: null,

	initialize: ({ search, total, onSearchChange }) => {
		const nextPriceRange = getPriceRangeFromSearch(search);

		set((state) => ({
			total,
			name: search.name,
			sort: search.sort,
			priceRange: nextPriceRange,
			onSearchChange,
			draftSort: state.drawerOpen ? state.draftSort : search.sort,
			draftPriceRange: state.drawerOpen
				? state.draftPriceRange
				: nextPriceRange,
		}));
	},

	setDrawerOpen: (drawerOpen) => {
		set((state) => {
			if (!drawerOpen && state.drawerDismissDisabled) {
				return state;
			}

			return {
				drawerOpen,
				drawerDismissDisabled: drawerOpen ? false : state.drawerDismissDisabled,
				draftSort: drawerOpen ? state.sort : state.draftSort,
				draftPriceRange: drawerOpen ? state.priceRange : state.draftPriceRange,
			};
		});
	},

	setDrawerDismissDisabled: (drawerDismissDisabled) => {
		set({ drawerDismissDisabled });
	},

	setName: (name) => {
		set({ name });
		get().onSearchChange?.({ name, page: 1 });
	},

	setSort: (sort) => {
		set({ sort });
		get().onSearchChange?.({ sort, page: 1 });
	},

	setPriceRange: (priceRange) => {
		set({ priceRange });
		get().onSearchChange?.({
			minPrice: priceRange.min,
			maxPrice: priceRange.max,
			page: 1,
		});
	},

	setDraftSort: (draftSort) => set({ draftSort }),

	setDraftPriceRange: (draftPriceRange) => set({ draftPriceRange }),

	applyDraft: () => {
		const { draftPriceRange, draftSort, onSearchChange } = get();

		set({
			sort: draftSort,
			priceRange: draftPriceRange,
			drawerOpen: false,
			drawerDismissDisabled: false,
		});

		onSearchChange?.({
			sort: draftSort,
			minPrice: draftPriceRange.min,
			maxPrice: draftPriceRange.max,
			page: 1,
		});
	},

	reset: () => {
		const defaultPriceRange = getDefaultPriceRange();

		set({
			name: DEFAULT_HOTELS_PAGE_SEARCH.name,
			sort: DEFAULT_HOTELS_PAGE_SEARCH.sort,
			priceRange: defaultPriceRange,
			draftSort: DEFAULT_HOTELS_PAGE_SEARCH.sort,
			draftPriceRange: defaultPriceRange,
			drawerOpen: false,
			drawerDismissDisabled: false,
		});

		useBookingStore.getState().resetBooking();

		const { checkInDate, checkOutDate } = useBookingStore.getState();
		get().onSearchChange?.({
			...DEFAULT_HOTELS_PAGE_SEARCH,
			checkIn: checkInDate,
			checkOut: checkOutDate ?? "",
		});
	},

	hasActiveFilter: () => {
		const { name, priceRange } = get();

		return (
			name.trim().length > 0 ||
			priceRange.min > DEFAULT_HOTELS_PAGE_SEARCH.minPrice ||
			priceRange.max < DEFAULT_HOTELS_PAGE_SEARCH.maxPrice
		);
	},
}));
