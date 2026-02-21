import { Calendar, cn } from "@zanadeal/ui";
import { eachDayOfInterval, format } from "date-fns";
import { Square } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange, DayButtonProps } from "react-day-picker";

const _GOOD_PRICE_THRESHOLD = 100;

export type CalendarPrices = {
	startDate: Date;
	endDate: Date | null;
	price: number;
	promoPrice?: number;
}[];

interface Props {
	className?: string;
	prices: CalendarPrices;
	onSelectFromProps?: (date: DateRange | undefined) => void;
	defaultRange?: DateRange;
}

type PriceType = {
	price: number;
	promoPrice?: number;
};

function CalendarRangeWithPrices({
	prices,
	className,
	onSelectFromProps,
	defaultRange,
}: Props) {
	const today = new Date();

	const [pricesMap, setPricesMap] = useState<Record<string, PriceType>>({});
	const [date, setDate] = useState<DateRange | undefined>(
		defaultRange || undefined,
	);

	useEffect(() => {
		prices.forEach((price) => {
			eachDayOfInterval({
				start: price.startDate,
				end: price.endDate!,
			}).forEach((date) => {
				const dateKey = format(date, "yyyy-MM-dd");
				setPricesMap((prev) => ({
					...prev,
					[dateKey]: {
						price: price.price,
						promoPrice: price.promoPrice || undefined,
					},
				}));
			});
		});
	}, [prices]);

	return (
		<div className={cn("w-full", className)}>
			<Calendar
				mode="range"
				selected={date}
				onSelect={(selectedDate) => {
					setDate(selectedDate);
					if (onSelectFromProps) {
						onSelectFromProps(selectedDate);
					}
				}}
				numberOfMonths={2}
				pagedNavigation
				showOutsideDays={false}
				className="rounded-lg border border-border bg-background p-2"
				classNames={{
					months: "sm:flex-col md:flex-row gap-8",
					month:
						"relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4",
					weekday: "w-12",
					day_button: "size-12",
					today: "*:after:hidden",
				}}
				components={{
					DayButton: (props: DayButtonProps) => (
						<DayButton {...props} pricesInfo={pricesMap} />
					),
				}}
				disabled={{
					before: today,
				}}
			/>
			<div className="mt-2 flex w-full items-center justify-center gap-6 font-light text-sm">
				<div className="flex items-center justify-center gap-2">
					<Square className="size-4 fill-emerald-500 stroke-emerald-500" />
					<span className="">Prix normaux</span>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Square className="size-4 fill-orange-500 stroke-orange-500" />
					<span className="">Prix promo</span>
				</div>
			</div>
		</div>
	);
}

interface DayButtonInterfaceProps extends DayButtonProps {
	pricesInfo: {
		[date: string]: {
			price: number;
			promoPrice?: number;
		};
	};
}

function DayButton({ pricesInfo, ...props }: DayButtonInterfaceProps) {
	const { day, modifiers, ...buttonProps } = props;
	const dateKey = format(day.date, "yyyy-MM-dd");
	const priceInfo = pricesInfo[dateKey];
	const isGoodPrice = true;

	return (
		<button {...buttonProps}>
			<span className="flex flex-col">
				{props.children}
				{priceInfo && (
					<>
						<p
							className={cn(
								"font-medium text-[10px]",
								isGoodPrice
									? "text-emerald-500"
									: "text-muted-foreground group-data-[selected]:text-primary-foreground/70",
							)}
						>
							${priceInfo.price}
						</p>
						<p
							className={cn(
								"font-medium text-[10px]",
								isGoodPrice
									? "text-orange-500"
									: "text-muted-foreground group-data-[selected]:text-primary-foreground/70",
							)}
						>
							${priceInfo.promoPrice}
						</p>
					</>
				)}
			</span>
		</button>
	);
}

export { CalendarRangeWithPrices };
