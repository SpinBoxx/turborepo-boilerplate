import type { ListHotelsInput } from "@zanadeal/api/features/hotel";

export type HotelSortField = Extract<
	ListHotelsInput["sort"]["field"],
	"name" | "startingPrice"
>;
export type HotelSortDirection = ListHotelsInput["sort"]["direction"];
export type HotelSortValue = `${HotelSortField}:${HotelSortDirection}`;

export interface HotelsPageSearch {
	page: number;
	limit: number;
	sort: HotelSortValue;
	name: string;
	minPrice: number;
	maxPrice: number;
}

export interface HotelPriceRange {
	min: number;
	max: number;
}

export const HOTEL_PRICE_RANGE_LIMITS: HotelPriceRange = {
	min: 0,
	max: 2000,
};

export const DEFAULT_HOTELS_PAGE_SEARCH: HotelsPageSearch = {
	page: 1,
	limit: 9,
	sort: "startingPrice:asc",
	name: "",
	minPrice: HOTEL_PRICE_RANGE_LIMITS.min,
	maxPrice: HOTEL_PRICE_RANGE_LIMITS.max,
};

export const HOTEL_SORT_OPTIONS: { label: string; value: HotelSortValue }[] = [
	{ label: "Prix croissant", value: "startingPrice:asc" },
	{ label: "Prix décroissant", value: "startingPrice:desc" },
	{ label: "Nom A -> Z", value: "name:asc" },
	{ label: "Nom Z -> A", value: "name:desc" },
];

const hotelSortValues = new Set(
	HOTEL_SORT_OPTIONS.map((option) => option.value),
);

export function isHotelSortValue(value: string): value is HotelSortValue {
	return hotelSortValues.has(value as HotelSortValue);
}

export function parseHotelSortValue(value: HotelSortValue): {
	field: HotelSortField;
	direction: HotelSortDirection;
} {
	const [field, direction] = value.split(":") as [
		HotelSortField,
		HotelSortDirection,
	];

	return { field, direction };
}

function clampPrice(value: number) {
	return Math.min(
		Math.max(value, HOTEL_PRICE_RANGE_LIMITS.min),
		HOTEL_PRICE_RANGE_LIMITS.max,
	);
}

function parsePositiveInteger(value: unknown, fallbackValue: number) {
	const parsedValue = Number(value);
	if (!Number.isInteger(parsedValue) || parsedValue < 1) {
		return fallbackValue;
	}

	return parsedValue;
}

function parsePrice(value: unknown, fallbackValue: number) {
	const parsedValue = Number(value);
	if (Number.isNaN(parsedValue)) {
		return fallbackValue;
	}

	return clampPrice(parsedValue);
}

export function parseHotelsPageSearch(
	search: Record<string, unknown>,
): HotelsPageSearch {
	const sort =
		typeof search.sort === "string" && isHotelSortValue(search.sort)
			? search.sort
			: DEFAULT_HOTELS_PAGE_SEARCH.sort;
	const minPrice = parsePrice(
		search.minPrice,
		DEFAULT_HOTELS_PAGE_SEARCH.minPrice,
	);
	const maxPrice = parsePrice(
		search.maxPrice,
		DEFAULT_HOTELS_PAGE_SEARCH.maxPrice,
	);

	return {
		page: parsePositiveInteger(search.page, DEFAULT_HOTELS_PAGE_SEARCH.page),
		limit: parsePositiveInteger(search.limit, DEFAULT_HOTELS_PAGE_SEARCH.limit),
		sort,
		name:
			typeof search.name === "string"
				? search.name
				: DEFAULT_HOTELS_PAGE_SEARCH.name,
		minPrice: Math.min(minPrice, maxPrice),
		maxPrice: Math.max(minPrice, maxPrice),
	};
}

export function buildListHotelsInput(
	search: HotelsPageSearch,
): ListHotelsInput {
	const { field, direction } = parseHotelSortValue(search.sort);
	const filters: ListHotelsInput["filters"] = {};
	const trimmedName = search.name.trim();

	if (trimmedName) {
		filters.name = {
			contains: trimmedName,
		};
	}

	if (
		search.minPrice > HOTEL_PRICE_RANGE_LIMITS.min ||
		search.maxPrice < HOTEL_PRICE_RANGE_LIMITS.max
	) {
		filters.startingPrice = {
			gte: search.minPrice,
			lte: search.maxPrice,
		};
	}

	return {
		sort: { field, direction },
		filters,
		page: search.page,
		limit: search.limit,
		take: search.limit,
		skip: (search.page - 1) * search.limit,
	};
}
