import { cn } from "@zanadeal/ui";
import { ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingSearchBarCalendarPopover } from "@/features/booking/BookinSearchBar/BookingSearchBarCalendarPopover";
import BookingGuestCountInput from "@/features/booking/ui/BookingGuestCountInput";
import { useHotelContext } from "../components/HotelProvider";

interface Props extends ComponentProps<"div"> {}

const HotelDetailStickyPanel = ({ className, ...props }: Props) => {
	const { hotel } = useHotelContext();

	return (
		<div
			className={cn(
				"md:sticky md:top-4 md:h-fit md:min-w-60 md:max-w-86 md:self-start md:rounded-xl md:bg-transparent md:p-0 md:shadow-none lg:min-w-70 xl:min-w-80",
				className,
			)}
			{...props}
		>
			<Card className="shadow-lg md:border">
				<CardContent className="flex flex-col gap-4 p-4 md:p-6">
					<div className="flex items-end gap-1">
						<span className="font-bold text-2xl text-primary md:text-3xl">
							€{hotel.startingPrice}
						</span>
						<span className="mb-1 text-muted-foreground text-sm">/ night</span>
					</div>

					<div className="hidden md:flex md:flex-col md:gap-4">
						<div className="space-y-1.5">
							<p className="font-medium text-sm">Date de séjour</p>
							<BookingSearchBarCalendarPopover
								buttonsProps={{
									size: "lg",
								}}
							/>
						</div>

						<div className="space-y-1.5">
							<p className="font-medium text-sm">Guests</p>
							<BookingGuestCountInput size="lg" />
						</div>
					</div>

					<Button
						size="lg"
						className="group mt-2 w-full font-bold md:text-base"
					>
						Select Rooms
						<ChevronRight className="transition-all group-hover:translate-x-2" />
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default HotelDetailStickyPanel;
