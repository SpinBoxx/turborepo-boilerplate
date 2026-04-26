import { currency } from "@zanadeal/utils";
import { useIntlayer } from "react-intlayer";
import { useBookingCheckoutContext } from "@/features/booking/components/BookingCheckoutProvider";

export default function NightlySummaryRow() {
	const { pricePreview } = useBookingCheckoutContext();
	const t = useIntlayer("price-details-card");

	const { nights, subtotal } = pricePreview;

	return (
		<div className="flex items-center justify-between text-sm">
			<span>{t.totalForNights(nights)({ count: nights })}</span>
			<span>{currency(subtotal)}</span>
		</div>
	);
}
