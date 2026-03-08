import SortSelect, { type SortOption } from "@/components/SortSelect";
import type { RoomSortField, SortDirection } from "../hooks/useRoomListParams";
import { useRoomListContext } from "../hooks/useRoomListParams";

const SORT_OPTIONS: SortOption[] = [
	{ label: "Hôtel (A → Z)", value: "name:asc" },
	{ label: "Hôtel (Z → A)", value: "name:desc" },
	{ label: "Date (récent)", value: "updatedAt:desc" },
	{ label: "Date (ancien)", value: "updatedAt:asc" },
];

export default function RoomSortSelect() {
	const { params, setSort } = useRoomListContext();
	const currentValue = `${params.sort.field}:${params.sort.direction}`;

	return (
		<SortSelect
			options={SORT_OPTIONS}
			value={currentValue}
			onChange={(value) => {
				const [f, d] = value.split(":") as [RoomSortField, SortDirection];
				setSort(f, d);
			}}
		/>
	);
}
