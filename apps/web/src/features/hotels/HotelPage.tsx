import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import CalendarWithComboBox from "@/components/calendar/CalendarWithComboBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import HotelAddress from "./components/HotelAddress";
import HotelCarousel from "./components/HotelCarousel";
import HotelName from "./components/HotelName";
import HotelProvider from "./components/HotelProvider";
import HotelDetailTabs from "./ui/HotelDetailTabs/HotelDetailTabs";

interface Props {
	hotel: HotelUserComputed;
}

const HotelPage = ({ hotel }: Props) => {
	return (
		<HotelProvider hotel={hotel}>
			<div className="flex w-full flex-col gap-6 pb-36 md:flex-row">
				<div className="flex min-w-0 shrink flex-col gap-6">
					<HotelCarousel />
					<div className="space-y-1">
						<HotelName className="font-bold text-2xl md:text-3xl" />
						<HotelAddress className="text-muted-foreground text-sm md:text-base" />
					</div>
					<HotelDetailTabs />
				</div>
				<div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-7xl rounded-t-xl bg-background p-4 shadow-2xl sm:px-8 md:sticky md:top-4 md:h-fit md:w-80 md:self-start md:rounded-xl md:bg-transparent md:p-0 md:shadow-none">
					<Card className="shadow-lg md:border">
						<CardContent className="flex flex-col gap-4 p-4 md:p-6">
							<div className="flex items-end gap-1">
								<span className="font-bold text-2xl text-primary md:text-3xl">
									€{hotel.startingPrice}
								</span>
								<span className="mb-1 text-muted-foreground text-sm">
									/ night
								</span>
							</div>

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
								<NumberField defaultValue={1} min={1} max={10}>
									<NumberFieldGroup>
										<NumberFieldDecrement />
										<NumberFieldInput className="text-center" />
										<NumberFieldIncrement />
									</NumberFieldGroup>
								</NumberField>
							</div>

							<Button size="lg" className="mt-2 w-full font-bold md:text-base">
								Select Rooms
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</HotelProvider>
	);
};

export default HotelPage;
