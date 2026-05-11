import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import HotelsPage from "@/features/hotels/pages/HotelsPage";
import {
	applyBookingDatesToHotelsSearch,
	type HotelsPageSearch,
	parseHotelsPageSearch,
} from "@/features/hotels/ui/HotelToolbar/hotel-toolbar.options";

export const Route = createFileRoute("/_app/hotels/")({
	validateSearch: (search): HotelsPageSearch => parseHotelsPageSearch(search),
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const checkInDate = useBookingStore((state) => state.checkInDate);
	const checkOutDate = useBookingStore((state) => state.checkOutDate);
	const effectiveSearch = applyBookingDatesToHotelsSearch(search, {
		checkInDate,
		checkOutDate,
	});

	useEffect(() => {
		if (
			search.checkIn === effectiveSearch.checkIn &&
			search.checkOut === effectiveSearch.checkOut
		) {
			return;
		}

		navigate({
			search: effectiveSearch,
			replace: true,
		});
	}, [effectiveSearch, navigate, search.checkIn, search.checkOut]);

	return (
		<HotelsPage
			search={effectiveSearch}
			onSearchChange={(nextSearch) => {
				navigate({
					search: {
						...effectiveSearch,
						...nextSearch,
					},
					replace: true,
				});
			}}
		/>
	);
}
