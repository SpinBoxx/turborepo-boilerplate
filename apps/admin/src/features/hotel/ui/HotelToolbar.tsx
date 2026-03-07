import { Button } from "@zanadeal/ui";
import { Plus } from "lucide-react";
import HotelSearchFilter from "./HotelSearchFilter";
import HotelSortSelect from "./HotelSortSelect";
import HotelViewToggle from "./HotelViewToggle";

interface Props {
	onAdd: () => void;
}

export default function HotelToolbar({ onAdd }: Props) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<HotelSearchFilter />

			<div className="flex items-center gap-3">
				<HotelViewToggle />
				<HotelSortSelect />
				<Button className="gap-2" onClick={onAdd}>
					<Plus className="size-4" />
					Ajouter
				</Button>
			</div>
		</div>
	);
}
