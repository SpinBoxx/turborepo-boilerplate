import { createFileRoute, redirect } from "@tanstack/react-router";
import HotelPage from "@/features/hotels/HotelPage";
import { getHotelById } from "@/features/hotels/hotel.api";

export const Route = createFileRoute("/_app/$hotelId/")({
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
	return <HotelPage hotel={hotel} />;
}
