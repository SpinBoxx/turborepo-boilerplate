import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHotels } from "../hotel.queries";
import HotelsCardList from "./HotelsCardList";

export default function PopularHotels() {
	const hotels = useHotels({
		take: 50,
		skip: 0,
		filters: {},
		sort: { field: "updatedAt", direction: "desc" },
		limit: 50,
		page: 1,
	});

	return (
		<div>
			<div className="flex items-end justify-between">
				<h3 className="font-semibold text-xl md:text-2xl">Popular hotels</h3>
				<Button
					className="h-fit text-blue-500 text-sm md:text-base"
					variant={"link"}
				>
					See all
					<ChevronRight />
				</Button>
			</div>
			{hotels.isLoading && !hotels.data ? (
				<HotelsCardList.Skeleton className="mt-4" />
			) : hotels.data ? (
				<HotelsCardList hotels={hotels.data} className="mt-4" />
			) : null}
		</div>
	);
}
