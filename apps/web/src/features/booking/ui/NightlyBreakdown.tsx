import { formatPrice } from "@zanadeal/utils";
import { date as formatDate } from "intlayer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useBookingCheckoutContext } from "@/features/booking/components/BookingCheckoutProvider";

export default function NightlyBreakdown() {
	const { pricePreview } = useBookingCheckoutContext();
	const t = useIntlayer("price-details-card");
	const { locale } = useIntlayerContext();
	const [open, setOpen] = useState(false);

	const { breakdown } = pricePreview;
	console.log(breakdown);

	const firstPrice = breakdown[0]?.price;
	const hasMixedPrices =
		breakdown.length > 1 && breakdown.some((n) => n.price !== firstPrice);

	if (!hasMixedPrices) return null;

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger className="flex w-full items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground">
				<ChevronDown
					aria-hidden="true"
					className="size-3.5 transition-transform duration-200 data-open:rotate-180"
					data-open={open || undefined}
				/>
				{open ? t.hideBreakdown : t.showBreakdown}
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="mt-2 space-y-1.5 border-muted border-l-2 pl-3">
					{breakdown.map((item) => (
						<div
							key={item.date.toISOString()}
							className="flex items-center justify-between text-muted-foreground text-xs"
						>
							<span>
								{t.nightOf}{" "}
								{formatDate(item.date, {
									dateStyle: "medium",
									locale,
								})}
							</span>
							<span className="font-medium text-foreground">
								{formatPrice(item.price)}
							</span>
						</div>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
