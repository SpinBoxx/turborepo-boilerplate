import { createFileRoute } from "@tanstack/react-router";
import ReviewCartCheckoutPage from "@/pages/checkout/ReviewCartCheckout";

export const Route = createFileRoute("/_checkout/review-cart-checkout/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <ReviewCartCheckoutPage />;
}
