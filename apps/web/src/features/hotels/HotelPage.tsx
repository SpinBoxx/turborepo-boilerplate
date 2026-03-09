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
import { BookingInfoDrawer } from "../booking/ui/BookingInfoDrawer";
import HotelAddress from "./components/HotelAddress";
import HotelCarousel from "./components/HotelCarousel";
import HotelName from "./components/HotelName";
import HotelProvider from "./components/HotelProvider";
import HotelDetailFixedFooter from "./ui/HotelDetailFixedFooter";
import HotelDetailStickyPanel from "./ui/HotelDetailStickyPanel";
import HotelDetailTabs from "./ui/HotelDetailTabs/HotelDetailTabs";

interface Props {
	hotel: HotelUserComputed;
}

const HotelPage = ({ hotel }: Props) => {
	return (
		<HotelProvider hotel={hotel}>
			<div className="flex w-full flex-col gap-6 pb-15 md:flex-row">
				<div className="flex min-w-0 shrink flex-col gap-6">
					<HotelCarousel />
					<div className="space-y-1">
						<HotelName className="font-bold text-2xl md:text-3xl" />
						<HotelAddress className="text-muted-foreground text-sm md:text-base" />
					</div>
					<HotelDetailTabs />
				</div>
				<HotelDetailStickyPanel className="hidden md:block" />
				<HotelDetailFixedFooter className="md:hidden" />
			</div>
		</HotelProvider>
	);
};

export default HotelPage;
