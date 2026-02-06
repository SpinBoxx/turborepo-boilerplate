import { useHotels } from "@/features/hotel/hotel.queries";
import HotelsLoading from "@/features/hotel/ui/HotelsLoading";

export default function DisplayRoomsByHotel() {
	const roomsByHotel = useHotels();

	if (!roomsByHotel.data) return <HotelsLoading />;

	return (
		<div>
			{roomsByHotel.data.map((hotel) => (
				<div key={hotel.id}>
					<h2>{hotel.name}</h2>
					<div>
						{hotel.rooms.map((room) => (
							<div key={room.id}>
								<p>Type: {room.type}</p>
								<p>Description: {room.description}</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
