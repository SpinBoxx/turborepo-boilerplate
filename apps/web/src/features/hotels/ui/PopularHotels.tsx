import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHotels } from "../hotel.queries";
import HotelsList from "./HotelList";

export default function PopularHotels() {
	const hotels = useHotels();

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
				<HotelsList.Skeleton className="mt-4" />
			) : hotels.data ? (
				<HotelsList hotels={hotels.data} className="mt-4" />
			) : null}
		</div>
	);
}
