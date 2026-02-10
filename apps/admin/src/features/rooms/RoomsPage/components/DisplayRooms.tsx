import { Badge } from "@zanadeal/ui";
import { useHotels } from "@/features/hotel/hotel.queries";
import HotelsLoading from "@/features/hotel/ui/HotelsLoading";
import { RoomCard } from "@/features/rooms/components/room";

export default function DisplayRoomsByHotel() {
	const roomsByHotel = useHotels();

	if (!roomsByHotel.data) return <HotelsLoading />;

	return (
		<div className="flex flex-col gap-8">
			{roomsByHotel.data.map((hotel) => (
				<div key={hotel.id} className="flex flex-col gap-4">
					<h2 className="relative flex items-center gap-3 pl-4 font-semibold text-lg after:absolute after:top-1/2 after:left-0 after:h-6 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-indigo-500 after:content-['']">
						{hotel.name}
						<Badge variant={"outline"}>{hotel.rooms.length}</Badge>
					</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
						{hotel.rooms.map((room) => (
							<RoomCard key={room.id} room={room} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
