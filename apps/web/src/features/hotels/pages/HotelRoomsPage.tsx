import { useRouter } from "@tanstack/react-router";
import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import BookingSearchBarDesktop from "@/features/booking/BookinSearchBar/BookingSearchBarDesktop";
import BookingSearchBarMobile from "@/features/booking/BookinSearchBar/BookingSearchBarMobile";
import RoomCardList from "@/features/rooms/ui/RoomCardList";
import HotelBreadcrumb from "../components/HotelBreadCrumb";
import HotelName from "../components/HotelName";
import HotelProvider, {
	type HotelAppliedBookingDates,
} from "../components/HotelProvider";

interface Props {
	appliedBookingDates: HotelAppliedBookingDates;
	hotel: HotelUserComputed;
}

const HotelRoomsPage = ({ appliedBookingDates, hotel }: Props) => {
	const router = useRouter();
	const [isFilteringRooms, setIsFilteringRooms] = useState(false);
	const t = useIntlayer("hotel-rooms-page");

	const filterRooms = async () => {
		if (isFilteringRooms) return;

		setIsFilteringRooms(true);

		try {
			await router.invalidate();
		} catch (_error) {
			toast.error(t.filterRoomsError.value);
		} finally {
			setIsFilteringRooms(false);
		}
	};

	return (
		<HotelProvider appliedBookingDates={appliedBookingDates} hotel={hotel}>
			<div className="flex flex-1 flex-col space-y-4">
				<HotelBreadcrumb />
				<BookingSearchBarMobile
					className="md:hidden"
					isLoading={isFilteringRooms}
					onSearch={filterRooms}
				/>
				<BookingSearchBarDesktop
					guestsInputClassName="flex-1 max-w-[12rem]"
					className="hidden md:block md:w-full"
					actionButton={{
						label: t.filterRooms.value,
						className: "lg:px-8",
						isLoading: isFilteringRooms,
						onClick: filterRooms,
					}}
				/>
				<div className="mt-7 space-y-1.5">
					<HotelName className="font-semibold text-xl" />
					<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
						{t.chooseRoom.value}
					</p>
				</div>
				<RoomCardList isLoading={isFilteringRooms} />
			</div>
		</HotelProvider>
	);
};

export default HotelRoomsPage;
