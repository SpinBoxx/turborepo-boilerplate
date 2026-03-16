import { Bath, BedDouble, HashIcon, Move, UsersRound } from "lucide-react";
import { Card, CardPanel } from "@/components/ui/card";
import RoomDescription from "../../components/RoomDescription";
import RoomInfoItem from "../../components/RoomInfoItem";
import { useRoomContext } from "../../components/RoomProvider";
import RoomDetailSectionTitle from "./RoomDetailSectionTitle";

export default function RoomDetailInformationTab() {
	const { room } = useRoomContext();

	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<RoomDetailSectionTitle>About this room</RoomDetailSectionTitle>
				<RoomDescription className="line-clamp-none text-muted-foreground" />
			</div>

			<div className="space-y-3">
				<RoomDetailSectionTitle>Room details</RoomDetailSectionTitle>
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
					<InfoCard>
						<RoomInfoItem icon={BedDouble} label="Beds" value={room.beds} />
					</InfoCard>
					<InfoCard>
						<RoomInfoItem icon={Bath} label="Baths" value={room.baths} />
					</InfoCard>
					<InfoCard>
						<RoomInfoItem
							icon={UsersRound}
							label="Guests"
							value={room.maxGuests}
						/>
					</InfoCard>
					<InfoCard>
						<RoomInfoItem icon={Move} label="m²" value={room.areaM2} />
					</InfoCard>
					<InfoCard className="xs:col-span-2">
						<RoomInfoItem
							icon={HashIcon}
							label="Rooms available"
							value={room.quantity}
						/>
					</InfoCard>
				</div>
			</div>
		</div>
	);
}

function InfoCard({ children, className }: React.ComponentProps<"div">) {
	return (
		<Card className={className}>
			<CardPanel className="px-4 py-3">{children}</CardPanel>
		</Card>
	);
}
