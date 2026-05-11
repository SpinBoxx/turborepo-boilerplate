import { cn } from "@zanadeal/ui";
import { CalendarX } from "lucide-react";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import HotelPricePerNight from "./HotelPricePerNight";
import { useHotelContext } from "./HotelProvider";

type HotelAvailabilityPriceVariant = "default" | "compact" | "badge" | "marker";

interface Props extends ComponentProps<"div"> {
	variant?: HotelAvailabilityPriceVariant;
	priceClassName?: string;
	nightClassName?: string;
	showStartingLabel?: boolean;
	unavailableOnly?: boolean;
}

const unavailableClassNameByVariant: Record<HotelAvailabilityPriceVariant, string> = {
	default:
		"flex min-w-0 items-start gap-2 rounded-lg border border-warning/24 bg-warning/6 px-3 py-2 text-warning-foreground",
	compact: "flex min-w-0 items-center gap-2 text-muted-foreground",
	badge:
		"inline-flex max-w-full items-center gap-1.5 rounded-full border border-warning/28 bg-background/92 px-2.5 py-1.5 font-medium text-warning-foreground text-xs shadow-sm backdrop-blur-sm",
	marker: "flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs",
};

function HotelUnavailableMessage({
	className,
	variant,
	...props
}: ComponentProps<"div"> & { variant: HotelAvailabilityPriceVariant }) {
	const t = useIntlayer("hotels");
	const isDefault = variant === "default";
	const message =
		variant === "badge" || variant === "marker"
			? t.noRoomsAvailableTitle.value
			: t.noRoomsAvailableForDates.value;

	return (
		<div
			className={cn(unavailableClassNameByVariant[variant], className)}
			{...props}
		>
			<CalendarX
				aria-hidden="true"
				className={cn(
					"shrink-0",
					isDefault ? "mt-0.5 size-4" : "size-3.5",
				)}
			/>
			<div className="min-w-0">
				{isDefault ? (
					<p className="line-clamp-1 font-medium text-sm leading-tight">
						{t.noRoomsAvailableTitle.value}
					</p>
				) : null}
				<span
					className={cn(
						"block min-w-0 truncate text-pretty leading-snug",
						isDefault ? "text-warning-foreground/80 text-xs" : "text-current",
					)}
				>
					{message}
				</span>
			</div>
		</div>
	);
}

export default function HotelAvailabilityPrice({
	className,
	variant = "default",
	priceClassName,
	nightClassName,
	showStartingLabel,
	unavailableOnly = false,
	...props
}: Props) {
	const { hotel } = useHotelContext();
	const t = useIntlayer("hotels");
	const isUnavailableForDates = hotel.isAvailableForDates === false;

	if (isUnavailableForDates) {
		return (
			<HotelUnavailableMessage
				className={className}
				variant={variant}
				{...props}
			/>
		);
	}

	if (unavailableOnly) {
		return null;
	}
	const shouldShowStartingLabel = showStartingLabel ?? variant !== "marker";

	return (
		<div className={cn("min-w-0", className)} {...props}>
			{shouldShowStartingLabel ? (
				<span className="flex translate-y-0.5 text-muted-foreground text-xs uppercase">
					{t.startingFrom.value}
				</span>
			) : null}
			<HotelPricePerNight
				className="flex-wrap"
				priceClassName={priceClassName}
				nightClassName={nightClassName}
			/>
		</div>
	);
}
