import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import BookingSearchBar from "@/features/booking/BookinSearchBar/BookingSearchBar";
import PopularHotels from "@/features/hotels/ui/PopularHotels";

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
});

function RouteComponent() {
	const t = useIntlayer("homepage");
	return (
		<div className="space-y-4">
			<div className="relative left-1/2 hidden w-screen -translate-x-1/2 sm:block">
				<img
					src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80"
					alt="Background"
					className="aspect-video h-96 w-full object-cover"
				/>
			</div>
			<h1 className="text-balance font-semibold text-3xl sm:hidden">
				{t.bookYourPerfectStay.value}
			</h1>

			<div className="space-y-4 sm:-translate-y-20 sm:space-y-18">
				<BookingSearchBar className="mx-auto" />
				<PopularHotels />
			</div>
		</div>
	);
}
