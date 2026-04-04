import { CalendarX2Icon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { useHotelContext } from "@/features/hotels/components/HotelProvider";
import RoomProvider from "../components/RoomProvider";
import RoomCard from "./RoomCard";

const RoomCardList = () => {
	const {
		hotel: { rooms },
	} = useHotelContext();
	const checkInDate = useBookingStore((state) => state.checkInDate);
	const checkOutDate = useBookingStore((state) => state.checkOutDate);
	const t = useIntlayer("room-card-list");

	if (rooms.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 border-dashed bg-card/70 px-6 py-16 text-center">
				<CalendarX2Icon className="size-8 text-muted-foreground" />
				<h2 className="font-semibold text-xl">
					{t.noRoomsAvailable.value}
				</h2>
				<p className="max-w-xl text-muted-foreground">
					{t.noRoomsDescription.value}
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{rooms.map((room) => (
				<RoomProvider key={room.id} room={room}>
					<RoomCard />
				</RoomProvider>
			))}
		</div>
	);
};

export default RoomCardList;
