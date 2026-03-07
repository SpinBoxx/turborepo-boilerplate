import { createFileRoute } from "@tanstack/react-router";
import BookingSearchBar from "@/features/booking/BookinSearchBar/BookingSearchBar";
import PopularHotels from "@/features/hotels/ui/PopularHotels";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const user = await context.auth.loadSession();
		console.log(user);

		const data = await orpc.amenity.list({});
		console.log(data);
	},
});

function RouteComponent() {
	return (
		<div className="space-y-4">
			<div className="relative left-1/2 hidden w-screen -translate-x-1/2 sm:block">
				<img
					src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80"
					alt="Background"
					className="aspect-video h-80 w-full object-cover"
				/>
			</div>
			<h1 className="text-balance font-semibold text-3xl sm:hidden">
				Book Your Perfect Stay
			</h1>

			<BookingSearchBar className="mx-auto sm:-translate-y-20" />
			<PopularHotels />
		</div>
	);
}
