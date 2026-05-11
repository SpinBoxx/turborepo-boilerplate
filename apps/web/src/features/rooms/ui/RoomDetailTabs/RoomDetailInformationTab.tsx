import { useIntlayer } from "react-intlayer";
import RoomDescription from "../../components/RoomDescription";
import RoomDetailSectionTitle from "./RoomDetailSectionTitle";

export default function RoomDetailInformationTab() {
	const t = useIntlayer("room-detail");

	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<RoomDetailSectionTitle>{t.aboutRoom.value}</RoomDetailSectionTitle>
				<RoomDescription className="line-clamp-none text-muted-foreground" />
			</div>
		</div>
	);
}
