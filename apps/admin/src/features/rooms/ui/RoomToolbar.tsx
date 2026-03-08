import RoomSearchFilter from "./RoomSearchFilter";
import RoomSortSelect from "./RoomSortSelect";

export default function RoomToolbar() {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<RoomSearchFilter />
			<div className="flex items-center gap-3">
				<RoomSortSelect />
			</div>
		</div>
	);
}
