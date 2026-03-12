import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
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
	return (
		<HotelProvider hotel={hotel}>
			<div className="space-y-4">
				<HotelBreadcrumb />
				<BookingSearchBarMobile className="md:hidden" />
				<BookingSearchBarDesktop
					guestsInputClassName="flex-1 max-w-[12rem]"
					className="hidden md:block md:w-full"
					actionButton={{ label: "Filter rooms", className: "lg:px-8" }}
				/>
				<div className="space-y-1.5">
					<HotelName className="font-semibold text-xl" />
					<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
						Choisissez la chambre qui vous convient le mieux parmi notre
						sélection de chambres confortables et élégantes, conçues pour
						répondre à tous vos besoins pendant votre séjour chez nous.
					</p>
				</div>
				<RoomCardList />
			</div>
		</HotelProvider>
	);
};

export default HotelRoomsPage;
