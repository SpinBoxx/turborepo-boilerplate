import H1 from "@/components/H1";
import { RoomListProvider } from "../hooks/useRoomListParams";
import RoomToolbar from "../ui/RoomToolbar";
import DisplayRoomsByHotel from "./components/DisplayRooms";

export default function RoomsPage() {
	return (
		<RoomListProvider>
			<div className="space-y-6">
				<div className="space-y-1">
					<H1>Chambres</H1>
					<p className="text-muted-foreground">
						Gérez les chambres de vos établissements par hôtel.
					</p>
				</div>
				<RoomToolbar />
				<DisplayRoomsByHotel />
			</div>
		</RoomListProvider>
	);
}
