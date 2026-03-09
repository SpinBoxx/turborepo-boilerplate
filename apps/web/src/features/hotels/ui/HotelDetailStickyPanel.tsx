import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import CalendarWithComboBox from "@/components/calendar/CalendarWithComboBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BookingGuestCountInput from "@/features/booking/ui/BookingGuestCountInput";
import { useHotelContext } from "../components/HotelProvider";

interface Props extends ComponentProps<"div"> {}

const HotelDetailStickyPanel = ({ className, ...props }: Props) => {
	const { hotel } = useHotelContext();

	return (
		<div
			className={cn(
				"md:sticky md:top-4 md:h-fit md:w-80 md:self-start md:rounded-xl md:bg-transparent md:p-0 md:shadow-none",
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

					<div className="hidden md:block">
						<div className="flex gap-2">
							<div className="flex-1 space-y-1.5">
								<p className="font-medium text-sm">Check-in</p>
								<CalendarWithComboBox
									placeholder="Add date"
									triggerProps={{
										className:
											"w-full text-sm! font-light focus:ring-1 focus:ring-primary",
									}}
								/>
							</div>
							<div className="flex-1 space-y-1.5">
								<p className="font-medium text-sm">Check-out</p>
								<CalendarWithComboBox
									placeholder="Add date"
									triggerProps={{
										className:
											"w-full text-sm! font-light focus:ring-1 focus:ring-primary",
									}}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<p className="font-medium text-sm">Guests</p>
							<BookingGuestCountInput />
						</div>
					</div>

					<Button size="lg" className="mt-2 w-full font-bold md:text-base">
						Select Rooms
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default HotelDetailStickyPanel;
