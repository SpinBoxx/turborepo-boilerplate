import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { getBookingQuoteById } from "@/features/booking/booking-quote.api";
import { getHotelById } from "@/features/hotels/hotel.api";
import { getPaymentStatus } from "@/features/payment/payment.api";
import PaymentConfirmationPage from "@/features/payment/pages/PaymentConfirmationPage";
import {
	getCheckoutRouteRecoveryRedirect,
	shouldRedirectExpiredQuoteBeforePayment,
} from "@/features/payment/services/checkout-route.service";
import { orpc } from "@/lib/orpc";
import CheckoutPage from "@/pages/checkout/CheckoutPage";

export const Route = createFileRoute("/_checkout/checkout")({
	validateSearch: z.object({
		quoteId: z.string().min(1),
		paymentAttemptId: z.string().min(1).optional(),
		session_id: z.string().min(1).optional(),
	}),
	component: RouteComponent,
	beforeLoad: async ({ context, search }) => {
		const user = await context.auth.loadSession();
		if (!user) {
			throw redirect({
				to: "/",
			});
		}

		try {
			const quote = await getBookingQuoteById({ id: search.quoteId });

			if (
				shouldRedirectExpiredQuoteBeforePayment({
					expiresAt: new Date(quote.expiresAt),
					hasPaymentAttemptId: Boolean(search.paymentAttemptId),
					quoteStatus: quote.status,
				})
			) {
				throw redirect({ to: "/review-cart-checkout" });
			}

			const room = await orpc.room.get({ id: quote.roomId });
			const hotel = await getHotelById({ id: room.hotelId });
			const paymentStatus = search.paymentAttemptId
				? await getPaymentStatus({ paymentAttemptId: search.paymentAttemptId })
				: null;

			return { quote, room, hotel, paymentStatus };
		} catch {
			const recoveryRedirect = getCheckoutRouteRecoveryRedirect({
				paymentAttemptId: search.paymentAttemptId,
				quoteId: search.quoteId,
			});

			if (recoveryRedirect) {
				throw redirect(recoveryRedirect);
			}

			throw new Error(
				"Unable to load checkout confirmation after the payment attempt was created.",
			);
		}
	},
});

function RouteComponent() {
	const ctx = Route.useRouteContext();
	const search = Route.useSearch();
	const paymentStatus = ctx.paymentStatus;

	if (search.paymentAttemptId && paymentStatus !== null) {
		return <PaymentConfirmationPage {...ctx} paymentStatus={paymentStatus} />;
	}

	return <CheckoutPage {...ctx} />;
}
