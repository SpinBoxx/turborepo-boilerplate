import { Link } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import { ChevronRight } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { useHotels } from "../hotel.queries";
import HotelsCardList from "./HotelsCardList";
import HotelsEmpty from "./HotelsEmpty";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "./HotelToolbar/hotel-toolbar.options";

interface Props {
	className?: string;
}

export default function HomepageHotels({ className }: Props) {
	const t = useIntlayer("homepage-hotels");

	const hotels = useHotels({
		take: 9,
		skip: 0,
		filters: {},
		sort: { field: "isPopular", direction: "desc" },
		limit: 9,
		page: 1,
	});

	return (
		<section className={cn("", className)}>
			<div className="flex items-end justify-between gap-4">
				<div>
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-xl md:text-2xl">
							{t.title.value}
						</h3>
						<Link
							to="/hotels"
							search={DEFAULT_HOTELS_PAGE_SEARCH}
							className="sm:hidden"
						>
							<Button
								className="h-fit text-blue-500 text-sm md:text-base"
								variant="link"
							>
								{t.seeAll.value}
								<ChevronRight />
							</Button>
						</Link>
					</div>
					<p className="mt-1 text-muted-foreground">{t.description.value}</p>
				</div>

				<Link
					to="/hotels"
					search={DEFAULT_HOTELS_PAGE_SEARCH}
					className="hidden sm:block"
				>
					<Button
						className="h-fit text-blue-500 text-sm md:text-base"
						variant="link"
					>
						{t.seeAll.value}
						<ChevronRight />
					</Button>
				</Link>
			</div>

			{hotels.isLoading && !hotels.data ? (
				<HotelsCardList.Skeleton className="mt-4" count={9} />
			) : hotels.data && hotels.data.total === 0 ? (
				<HotelsEmpty className="mt-4" hasDates={false} />
			) : hotels.data && hotels.data.total > 0 ? (
				<HotelsCardList hotels={hotels.data.items} className="mt-4" />
			) : null}
		</section>
	);
}
