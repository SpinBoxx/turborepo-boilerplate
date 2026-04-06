import { formatPrice } from "@zanadeal/utils";
import { useIntlayer } from "react-intlayer";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { HOTEL_PRICE_RANGE_LIMITS } from "./hotel-toolbar.options";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

export default function HotelPriceSlideRange() {
	const isMobile = useIsMobile();
	const t = useIntlayer("hotel-filters-drawer");

	const priceRange = useHotelToolbarStore((state) =>
		isMobile ? state.draftPriceRange : state.priceRange,
	);
	const setPriceRange = useHotelToolbarStore((state) =>
		isMobile ? state.setDraftPriceRange : state.setPriceRange,
	);
	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
					{t.priceRange.value}
				</p>
				<p className="font-medium text-sm">
					{formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
				</p>
			</div>
			<Slider
				max={HOTEL_PRICE_RANGE_LIMITS.max}
				min={HOTEL_PRICE_RANGE_LIMITS.min}
				step={10}
				value={[priceRange.min, priceRange.max]}
				onValueChange={(value) => {
					if (!Array.isArray(value) || value.length < 2) {
						return;
					}

					setPriceRange({ min: value[0], max: value[1] });
				}}
			/>
			<div className="grid grid-cols-2 gap-3 text-sm">
				<div className="rounded-xl border bg-muted/40 px-3 py-2">
					<p className="text-muted-foreground text-xs uppercase">
						{t.min.value}
					</p>
					<p className="mt-1 font-medium">{formatPrice(priceRange.min)}</p>
				</div>
				<div className="rounded-xl border bg-muted/40 px-3 py-2">
					<p className="text-muted-foreground text-xs uppercase">
						{t.max.value}
					</p>
					<p className="mt-1 font-medium">{formatPrice(priceRange.max)}</p>
				</div>
			</div>
		</section>
	);
}
