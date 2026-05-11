import { currency, getTotalPriceByRange, stringToDate } from "@zanadeal/utils";
import { Info } from "lucide-react";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { useHotelContext } from "@/features/hotels/components/HotelProvider";
import { cn } from "@/lib/utils";
import RoomPriceBreakdownDialog from "./RoomPriceBreakdownDialog";
import RoomPriceInfoTooltip from "./RoomPriceInfoTooltip";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {
	labelClassName?: string;
	nightClassName?: string;
	price?: number;
	priceClassName?: string;
}

export default function RoomTotalPrice({
	className,
	labelClassName,
	nightClassName,
	price,
	priceClassName,
	...props
}: Props) {
	const {
		room: { prices },
	} = useRoomContext();
	const { appliedBookingDates } = useHotelContext();
	const t = useIntlayer("room-total-price");

	if (!appliedBookingDates) {
		return null;
	}

	const totalPrice = getTotalPriceByRange(
		prices,
		stringToDate(appliedBookingDates.checkInDate),
		stringToDate(appliedBookingDates.checkOutDate),
	);

	return (
		<div className={cn("space-y-1.5", className)} {...props}>
			<RoomPriceBreakdownDialog>
				<div className="flex flex-col items-start gap-0">
					<span
						className={cn(
							"text-muted-foreground text-xs uppercase",
							labelClassName,
						)}
					>
						{t.totalPrice.value}
					</span>
					<div className="flex items-center gap-1.5">
						<span
							className={cn("font-bold text-2xl text-primary", priceClassName)}
						>
							{currency(totalPrice)}
						</span>
						<RoomPriceInfoTooltip>
							<Info className="size-4.5" />
						</RoomPriceInfoTooltip>
					</div>
				</div>
			</RoomPriceBreakdownDialog>
		</div>
	);
}
