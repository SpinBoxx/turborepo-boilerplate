import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useIntlayer } from "react-intlayer";
import BookingSearchBar from "@/features/booking/BookinSearchBar/BookingSearchBar";
import PopularHotels from "@/features/hotels/ui/PopularHotels";

const FindHotelsOnMap = lazy(
	() => import("@/features/hotels/ui/HotelsMap/FindHotelsOnMap"),
);

function FindHotelsOnMapFallback() {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="h-7 w-64 animate-pulse rounded-md bg-muted" />
				<div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
			</div>
			<div className="h-112 w-full animate-pulse rounded-xl bg-muted" />
		</div>
	);
}

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Zanadeal - Book your perfect stay",
				name: "Zanadeal - Book your perfect stay",
				content:
					"Discover and book your perfect stay in Madagascar with Zanadeal. Explore a wide range of hotels, compare prices, and find the best deals for your next trip.",
			},
		],
	}),
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

			<div className="space-y-7 sm:space-y-9 sm:*:-translate-y-20">
				<BookingSearchBar />
				<PopularHotels className="sm:mt-14" />
				<Suspense fallback={<FindHotelsOnMapFallback />}>
					<FindHotelsOnMap />
				</Suspense>
			</div>
		</div>
	);
}
