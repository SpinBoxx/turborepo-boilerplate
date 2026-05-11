import { currency } from "@zanadeal/utils";
import { useIntlayer } from "react-intlayer";
import { useBookingCheckoutContext } from "@/features/booking/components/BookingCheckoutProvider";

export default function PriceTotalRow() {
	const { pricePreview } = useBookingCheckoutContext();
	const t = useIntlayer("price-details-card");

	return (
		<div className="flex items-center justify-between">
			<span className="font-semibold">{t.totalPrice}</span>
			<div className="text-right">
				<span className="font-bold text-lg text-primary">
					{currency(pricePreview.total)}
				</span>
				<p className="text-muted-foreground text-xs uppercase">
					{t.inclusiveOfTaxes}
				</p>
			</div>
		</div>
	);
}
