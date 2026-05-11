import { Info } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookingCheckoutContext } from "@/features/booking/components/BookingCheckoutProvider";

export default function TaxesRow() {
	const { pricePreview } = useBookingCheckoutContext();
	const t = useIntlayer("price-details-card");

	return (
		<div className="flex items-center justify-between text-sm">
			<span className="flex items-center gap-1">
				{t.taxesAndFees}
				<Tooltip>
					<TooltipTrigger
						delay={0}
						render={
							<button type="button" aria-label={t.taxesAndFees.value}>
								<Info
									aria-hidden="true"
									className="size-3.5 text-muted-foreground"
								/>
							</button>
						}
					/>
					<TooltipPopup>{t.taxesInfo}</TooltipPopup>
				</Tooltip>
			</span>
			<span>{pricePreview.taxAmount}</span>
		</div>
	);
}
