import { Link } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHotels } from "../hotel.queries";
import HotelsCardList from "./HotelsCardList";
import { DEFAULT_HOTELS_PAGE_SEARCH } from "./HotelToolbar/hotel-toolbar.options";

interface Props {
	className?: string;
}

export default function PopularHotels({ className }: Props) {
	const hotels = useHotels({
		take: 50,
		skip: 0,
		filters: {},
		sort: { field: "updatedAt", direction: "desc" },
		limit: 50,
		page: 1,
	});

	return (
		<div className={cn("", className)}>
			<div className="flex items-end justify-between">
				<div>
					<h3 className="font-semibold text-xl md:text-2xl">Popular hotels</h3>
					<p className="mt-1 text-muted-foreground">
						Handpicked stays for the perfect getaway.
					</p>
				</div>
				<Link to="/hotels" search={DEFAULT_HOTELS_PAGE_SEARCH}>
					<Button
						className="h-fit text-blue-500 text-sm md:text-base"
						variant={"link"}
					>
						See all
						<ChevronRight />
					</Button>
				</Link>
			</div>
			{hotels.isLoading && !hotels.data ? (
				<HotelsCardList.Skeleton className="mt-4" />
			) : hotels.data ? (
				<HotelsCardList hotels={hotels.data.items} className="mt-4" />
			) : null}
		</div>
	);
}
