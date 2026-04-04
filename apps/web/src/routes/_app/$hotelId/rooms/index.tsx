import { createFileRoute, redirect } from "@tanstack/react-router";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { getHotelById } from "@/features/hotels/hotel.api";
import HotelRoomsPage from "@/features/hotels/pages/HotelRoomsPage";

export const Route = createFileRoute("/_app/$hotelId/rooms/")({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		const { hotelId } = params;
		const { checkInDate, checkOutDate } = useBookingStore.getState();
		try {
			if (!checkInDate || !checkOutDate) {
				throw redirect({
					to: "/",
				});
			}
			const hotel = await getHotelById({
				id: hotelId,
				checkInDate,
				checkOutDate,
			});
			if (!hotel) {
				throw redirect({
					to: "/",
				});
			}
			return { hotel };
		} catch (_error) {
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
