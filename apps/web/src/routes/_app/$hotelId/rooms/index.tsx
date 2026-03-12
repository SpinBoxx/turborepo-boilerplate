import { createFileRoute, redirect } from "@tanstack/react-router";
import { getHotelById } from "@/features/hotels/hotel.api";
import HotelRoomsPage from "@/features/hotels/pages/HotelRoomsPage";

export const Route = createFileRoute("/_app/$hotelId/rooms/")({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const { hotelId } = params;
		try {
			const hotel = await getHotelById({ id: hotelId });
			if (!hotel) {
				throw redirect({
					to: "/",
				});
			}
			return { hotel };
		} catch (error) {
			throw redirect({
				to: "/",
			});
		}
	},
});

function RouteComponent() {
	const { hotel } = Route.useRouteContext();
	return <HotelRoomsPage hotel={hotel} />;
}
