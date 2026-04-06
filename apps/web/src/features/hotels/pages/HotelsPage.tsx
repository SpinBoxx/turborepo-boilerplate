import type { ListHotelsInput } from "@zanadeal/api/features/hotel";
import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { useIntlayer } from "react-intlayer";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useHotels } from "../hotel.queries";
import HotelsCardList from "../ui/HotelsCardList";
import HotelsEmpty from "../ui/HotelsEmpty";
import HotelToolbar from "../ui/HotelToolbar/HotelToolbar";
import {
	buildListHotelsInput,
	type HotelsPageSearch,
} from "../ui/HotelToolbar/hotel-toolbar.options";
import { useHotelToolbarStore } from "../ui/HotelToolbar/hotel-toolbar.store";

interface HotelsPageProps {
	search: HotelsPageSearch;
	onSearchChange: (nextSearch: Partial<HotelsPageSearch>) => void;
}

function buildVisiblePages(currentPage: number, pageCount: number) {
	const pages = new Set<number>([
		1,
		pageCount,
		currentPage - 1,
		currentPage,
		currentPage + 1,
	]);
	return [...pages]
		.filter((page) => page >= 1 && page <= pageCount)
		.sort((left, right) => left - right);
}

export default function HotelsPage({
	search,
	onSearchChange,
}: HotelsPageProps) {
	const initializeToolbar = useHotelToolbarStore((state) => state.initialize);
	const t = useIntlayer("hotels-page");
	const hotelsInput: ListHotelsInput = buildListHotelsInput(search);
	const hotelsQuery = useHotels(hotelsInput);
	const hotels = hotelsQuery.data?.items ?? [];
	const total = hotelsQuery.data?.total ?? 0;
	const pageCount = hotelsQuery.data?.pageCount ?? 0;
	const visiblePages = buildVisiblePages(search.page, pageCount || 1);

	useEffect(() => {
		initializeToolbar({ search, total, onSearchChange });
	}, [initializeToolbar, onSearchChange, search, total]);

	return (
		<section className="mt-6 space-y-5">
			<HotelToolbar />

			{hotelsQuery.isLoading && !hotelsQuery.data ? (
				<HotelsCardList.Skeleton count={search.limit} />
			) : hotelsQuery.isError ? (
				<div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
					<AlertCircleIcon className="size-5" />
					<span>
						{hotelsQuery.error instanceof Error
							? hotelsQuery.error.message
							: t.loadError.value}
					</span>
				</div>
			) : hotels.length === 0 ? (
				<HotelsEmpty hasDates={!!(search.checkIn && search.checkOut)} />
			) : (
				<>
					<HotelsCardList hotels={hotels} />
					{pageCount > 1 ? (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(event) => {
											event.preventDefault();
											if (search.page > 1) {
												onSearchChange({ page: search.page - 1 });
											}
										}}
									/>
								</PaginationItem>
								{visiblePages.map((page) => (
									<PaginationItem key={page}>
										<PaginationLink
											href="#"
											isActive={page === search.page}
											onClick={(event) => {
												event.preventDefault();
												onSearchChange({ page });
											}}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(event) => {
											event.preventDefault();
											if (search.page < pageCount) {
												onSearchChange({ page: search.page + 1 });
											}
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					) : null}
				</>
			)}
		</section>
	);
}
