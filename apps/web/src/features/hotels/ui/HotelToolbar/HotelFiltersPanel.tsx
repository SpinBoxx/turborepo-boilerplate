import { useIntlayer } from "react-intlayer";
import HotelDateFilter from "./HotelDateFilter";
import HotelPriceSlideRange from "./HotelPriceSlideRange";
import HotelSortBy from "./HotelSortBy";

interface HotelFiltersPanelProps {
	showSort?: boolean;
}

export default function HotelFiltersPanel({
	showSort = false,
}: HotelFiltersPanelProps) {
	const t = useIntlayer("hotel-filters-drawer");

	return (
		<div className="space-y-5">
			<HotelDateFilter />

			{showSort ? (
				<section className="flex flex-col space-y-2">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
						{t.sortBy.value}
					</p>
					<HotelSortBy />
				</section>
			) : null}

			<HotelPriceSlideRange />
		</div>
	);
}
