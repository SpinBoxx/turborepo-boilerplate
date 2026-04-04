import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import { useIntlayer } from "react-intlayer";
import BookingSearchBarDesktop from "@/features/booking/BookinSearchBar/BookingSearchBarDesktop";
import BookingSearchBarMobile from "@/features/booking/BookinSearchBar/BookingSearchBarMobile";
import RoomCardList from "@/features/rooms/ui/RoomCardList";
import HotelBreadcrumb from "../components/HotelBreadCrumb";
import HotelName from "../components/HotelName";
import HotelProvider from "../components/HotelProvider";

interface Props {
	hotel: HotelUserComputed;
}

const HotelRoomsPage = ({ hotel }: Props) => {
	const t = useIntlayer("hotel-rooms-page");

	return (
		<HotelProvider hotel={hotel}>
			<div className="space-y-4">
				<HotelBreadcrumb />
				<BookingSearchBarMobile className="md:hidden" />
				<BookingSearchBarDesktop
					guestsInputClassName="flex-1 max-w-[12rem]"
					className="hidden md:block md:w-full"
					actionButton={{ label: t.filterRooms.value, className: "lg:px-8" }}
				/>
				<div className="mt-7 space-y-1.5">
					<HotelName className="font-semibold text-xl" />
					<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
						{t.chooseRoom.value}
					</p>
				</div>
				<RoomCardList />
			</div>
		</HotelProvider>
	);
};

export default HotelRoomsPage;
