import type { BookingQuoteComputed } from "@zanadeal/api/features/booking-quote";
import { currency } from "@zanadeal/utils";
import { Info } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import {
	Card,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { getCheckoutQuotePriceDetails } from "../services/checkout-quote-price-details.service";

interface CheckoutQuotePriceDetailsCardProps {
	quote: BookingQuoteComputed;
}

export default function CheckoutQuotePriceDetailsCard({
	quote,
}: CheckoutQuotePriceDetailsCardProps) {
	const t = useIntlayer("price-details-card");
	const priceDetails = getCheckoutQuotePriceDetails(quote);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.title}</CardTitle>
			</CardHeader>
			<CardPanel className="flex flex-col gap-3">
				<div className="flex items-center justify-between text-sm">
					<span>
						{t.totalForNights(priceDetails.nights)({
							count: priceDetails.nights,
						})}
					</span>
					<span>{currency(priceDetails.subtotalAmount)}</span>
				</div>

				{priceDetails.hasDiscount ? (
					<div className="flex items-center justify-between text-sm text-success">
						<span>{t.discount}</span>
						<span>{currency(-priceDetails.discountAmount)}</span>
					</div>
				) : null}

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
					<span>{currency(priceDetails.taxAmount)}</span>
				</div>

				<Separator />

				<div className="flex items-center justify-between">
					<span className="font-semibold">{t.totalPrice}</span>
					<div className="text-right">
						<span className="font-bold text-lg text-primary">
							{currency(priceDetails.totalAmount)}
						</span>
						<p className="text-muted-foreground text-xs uppercase">
							{t.inclusiveOfTaxes}
						</p>
					</div>
				</div>
			</CardPanel>
		</Card>
	);
}