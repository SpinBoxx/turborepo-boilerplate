import SearchFilter from "@/components/SearchFilter";
import { useRoomListContext } from "../hooks/useRoomListParams";

export default function RoomSearchFilter() {
	const { setSearch } = useRoomListContext();
	return (
		<SearchFilter
			onSearch={setSearch}
			placeholder="Rechercher un hôtel..."
		/>
	);
}
