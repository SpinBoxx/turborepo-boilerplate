import { Link } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import { ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingSearchBarCalendarPopover } from "@/features/booking/BookinSearchBar/BookingSearchBarCalendarPopover";
import BookingGuestCountInput from "@/features/booking/ui/BookingGuestCountInput";
import HotelPricePerNight from "../components/HotelPricePerNight";
import { useHotelContext } from "../components/HotelProvider";

interface Props extends ComponentProps<"div"> {}

const HotelDetailStickyPanel = ({ className, ...props }: Props) => {
	const { hotel } = useHotelContext();

	const t = useIntlayer("hotels");

	return (
		<div
			className={cn(
				"md:sticky md:top-4 md:h-fit md:min-w-fit md:max-w-86 md:self-start md:rounded-xl md:bg-transparent md:p-0 md:shadow-none lg:min-w-70 xl:min-w-80",
				className,
			)}
			{...props}
		>
			<Card className="shadow-lg md:border">
				<CardContent className="flex flex-col gap-4 p-4 md:p-6">
					<div>
						<span className="font-light text-muted-foreground text-sm uppercase">
							{t.startingFrom.value}
						</span>
						<HotelPricePerNight priceClassName="text-[27px]" />
					</div>

					<div className="hidden md:flex md:flex-col md:gap-4">
						<div className="space-y-1.5">
							<p className="font-medium text-sm">{t.dateOfStay.value}</p>
							<BookingSearchBarCalendarPopover
								buttonsProps={{
									size: "lg",
								}}
							/>
						</div>

						<div className="space-y-1.5">
							<p className="font-medium text-sm">{t.guests.value}</p>
							<BookingGuestCountInput size="lg" />
						</div>
					</div>
					<Link to={"/$hotelId/rooms"} params={{ hotelId: hotel.id }}>
						<Button
							size="lg"
							className="group mt-2 w-full font-bold md:text-base"
						>
							{t.selectRooms.value}
							<ChevronRight className="transition-all group-hover:translate-x-2" />
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
};

export default HotelDetailStickyPanel;
