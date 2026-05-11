import { createFileRoute, redirect } from "@tanstack/react-router";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import ReviewCartCheckoutPage from "@/features/booking/pages/ReviewCartCheckoutPage";
import { getHotelById } from "@/features/hotels/hotel.api";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/_checkout/review-cart-checkout/")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { checkInDate, checkOutDate, roomId, guestCount } =
			useBookingStore.getState();

		if (!checkInDate || !checkOutDate || !roomId) {
			throw redirect({ to: "/" });
		}

		try {
			const room = await orpc.room.get({ id: roomId });
			const hotel = await getHotelById({ id: room.hotelId });

			return { room, hotel, checkInDate, checkOutDate, guestCount };
		} catch {
			throw redirect({ to: "/" });
		}
	},
});

function RouteComponent() {
	const ctx = Route.useRouteContext();
	return <ReviewCartCheckoutPage {...ctx} />;
}
