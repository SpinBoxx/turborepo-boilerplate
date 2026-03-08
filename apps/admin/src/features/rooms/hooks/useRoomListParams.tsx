import type { HotelAdminComputed } from "@zanadeal/api/features/hotel";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { useHotels } from "../../hotel/hotel.queries";

// ─── Types ──────────────────────────────────────────────────────────

export type RoomSortField = "name" | "updatedAt";
export type SortDirection = "asc" | "desc";

export interface RoomListParams {
	sort: { field: RoomSortField; direction: SortDirection };
	filters: {
		name?: { contains?: string };
	};
	page: number;
	limit: number;
}

// ─── Context value ──────────────────────────────────────────────────

interface RoomListContextValue {
	/** Current API params (sort, filters, pagination) */
	params: RoomListParams;
	/** Fetched hotels with their rooms */
	hotels: HotelAdminComputed[];
	/** Query states */
	isPending: boolean;
	isError: boolean;
	errorMessage: string;
	/** Setters */
	setSearch: (search: string) => void;
	setSort: (field: RoomSortField, direction: SortDirection) => void;
	setPage: (page: number) => void;
}

const RoomListContext = createContext<RoomListContextValue | null>(null);

// ─── Defaults ───────────────────────────────────────────────────────

const DEFAULT_PARAMS: RoomListParams = {
	sort: { field: "name", direction: "asc" },
	filters: {},
	page: 1,
	limit: 50,
};

// ─── Provider ───────────────────────────────────────────────────────

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

export function RoomListProvider({ children }: { children: React.ReactNode }) {
	const [params, setParams] = useState<RoomListParams>(DEFAULT_PARAMS);

	const { data, isPending, isError, error } = useHotels(params);

	const hotels = useMemo(
		() => (data ?? []) as HotelAdminComputed[],
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
		(field: RoomSortField, direction: SortDirection) => {
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

	const value = useMemo<RoomListContextValue>(
		() => ({
			params,
			hotels,
			isPending,
			isError,
			errorMessage: getErrorMessage(error),
			setSearch,
			setSort,
			setPage,
		}),
		[params, hotels, isPending, isError, error, setSearch, setSort, setPage],
	);

	return (
		<RoomListContext.Provider value={value}>
			{children}
		</RoomListContext.Provider>
	);
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useRoomListContext() {
	const ctx = useContext(RoomListContext);
	if (!ctx) {
		throw new Error(
			"useRoomListContext must be used within <RoomListProvider>",
		);
	}
	return ctx;
}
