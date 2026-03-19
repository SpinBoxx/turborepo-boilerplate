import { useIsMobile } from "@/hooks/use-mobile";
import RoomDetailDialog from "./RoomDetailDialog";
import RoomDetailDrawer from "./RoomDetailDrawer";

interface Props {
	children: React.ReactElement;
}

export default function RoomDetail({ children }: Props) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return <RoomDetailDrawer>{children}</RoomDetailDrawer>;
	}

	return <RoomDetailDialog>{children}</RoomDetailDialog>;
}
