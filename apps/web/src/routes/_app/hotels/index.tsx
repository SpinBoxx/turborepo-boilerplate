import { createFileRoute } from "@tanstack/react-router";
import HotelsPage from "@/features/hotels/pages/HotelsPage";
import {
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

	return (
		<HotelsPage
			search={search}
			onSearchChange={(nextSearch) => {
				navigate({
					search: {
						...search,
						...nextSearch,
					},
					replace: true,
				});
			}}
		/>
	);
}
