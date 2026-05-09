import { Link } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import { ChevronRight } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { useHotels } from "../hotel.queries";
import HotelsCardList from "./HotelsCardList";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "./HotelToolbar/hotel-toolbar.options";

interface Props {
	className?: string;
}

export default function PopularHotels({ className }: Props) {
	const t = useIntlayer("popular-hotels");

	const hotels = useHotels({
		take: 6,
		skip: 0,
		filters: {
			isPopular: {
				equal: true,
			},
		},
		sort: { field: "updatedAt", direction: "desc" },
		limit: 6,
		page: 1,
	});

	if (hotels.data && hotels.data.total === 0) return null;

	return (
		<div className={cn("", className)}>
			<div className="flex items-end justify-between">
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
								variant={"link"}
							>
								{t.seeAll.value}
								<ChevronRight />
							</Button>
						</Link>
					</div>
					<p className="mt-1 text-balance text-muted-foreground">
						{t.description.value}
					</p>
				</div>

				<Link
					to="/hotels"
					search={DEFAULT_HOTELS_PAGE_SEARCH}
					className="hidden sm:block"
				>
					<Button
						className="h-fit text-blue-500 text-sm md:text-base"
						variant={"link"}
					>
						{t.seeAll.value}
						<ChevronRight />
					</Button>
				</Link>
			</div>

			{hotels.isLoading && !hotels.data ? (
				<HotelsCardList.Skeleton className="mt-4" />
			) : hotels.data && hotels.data.total > 0 ? (
				<HotelsCardList hotels={hotels.data.items} className="mt-4" />
			) : null}
		</div>
	);
}
