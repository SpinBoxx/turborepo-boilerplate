import type {
	HotelAdminComputed,
	ListHotelsInput,
} from "@zanadeal/api/features/hotel";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { useHotels } from "../hotel.queries";

// ─── Types ──────────────────────────────────────────────────────────

export type HotelSortField = ListHotelsInput["sort"]["field"];
export type SortDirection = "asc" | "desc";
export type ViewMode = "grid" | "list";

export interface HotelListParams {
	sort: { field: HotelSortField; direction: SortDirection };
	filters: {
		name?: { contains?: string };
	};
	page: number;
	limit: number;
}

// ─── Context value ──────────────────────────────────────────────────

interface HotelListContextValue {
	/** Current API params (sort, filters, pagination) */
	params: HotelListParams;
	/** Fetched hotels (admin-level) */
	hotels: HotelAdminComputed[];
	/** Query states */
	isPending: boolean;
	isError: boolean;
	errorMessage: string;
	/** UI state */
	viewMode: ViewMode;
	/** Setters */
	setSearch: (search: string) => void;
	setSort: (field: HotelSortField, direction: SortDirection) => void;
	setPage: (page: number) => void;
	setViewMode: (mode: ViewMode) => void;
}

const HotelListContext = createContext<HotelListContextValue | null>(null);

// ─── Defaults ───────────────────────────────────────────────────────

const DEFAULT_PARAMS: HotelListParams = {
	sort: { field: "updatedAt", direction: "desc" },
	filters: {},
	page: 1,
	limit: 20,
};

// ─── Provider ───────────────────────────────────────────────────────

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

export function HotelListProvider({ children }: { children: React.ReactNode }) {
	const [params, setParams] = useState<HotelListParams>(DEFAULT_PARAMS);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const { data, isPending, isError, error } = useHotels(params);

	const hotels = useMemo(
		() => (data?.items ?? []) as HotelAdminComputed[],
		[data],
	);

	const setSearch = useCallback((search: string) => {
		setParams((prev) => ({
			...prev,
			page: 1,
			filters: {
				...prev.filters,
				name: search ? { contains: search } : undefined,
			},
		}));
	}, []);

	const setSort = useCallback(
		(field: HotelSortField, direction: SortDirection) => {
			setParams((prev) => ({
				...prev,
				page: 1,
				sort: { field, direction },
			}));
		},
		[],
	);

	const setPage = useCallback((page: number) => {
		setParams((prev) => ({ ...prev, page }));
	}, []);

	const value = useMemo<HotelListContextValue>(
		() => ({
			params,
			hotels,
			isPending,
			isError,
			errorMessage: getErrorMessage(error),
			viewMode,
			setSearch,
			setSort,
			setPage,
			setViewMode,
		}),
		[
			params,
			hotels,
			isPending,
			isError,
			error,
			viewMode,
			setSearch,
			setSort,
			setPage,
		],
	);

	return (
		<HotelListContext.Provider value={value}>
			{children}
		</HotelListContext.Provider>
	);
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useHotelListContext() {
	const ctx = useContext(HotelListContext);
	if (!ctx) {
		throw new Error(
			"useHotelListContext must be used within <HotelListProvider>",
		);
	}
	return ctx;
}
