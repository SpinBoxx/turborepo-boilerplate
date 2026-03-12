import { useHotelContext } from "@/features/hotels/components/HotelProvider";
import RoomProvider from "../components/RoomProvider";
import RoomCard from "./RoomCard";

const RoomCardList = () => {
	const {
		hotel: { rooms },
	} = useHotelContext();
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
