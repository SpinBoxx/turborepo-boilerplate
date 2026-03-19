import RoomDescription from "../../components/RoomDescription";
import RoomDetailSectionTitle from "./RoomDetailSectionTitle";

export default function RoomDetailInformationTab() {
	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<RoomDetailSectionTitle>About this room</RoomDetailSectionTitle>
				<RoomDescription className="line-clamp-none text-muted-foreground" />
			</div>
		</div>
	);
}
