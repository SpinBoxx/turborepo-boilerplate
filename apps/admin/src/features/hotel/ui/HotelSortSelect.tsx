import SortSelect, { type SortOption } from "@/components/SortSelect";
import type {
	HotelSortField,
	SortDirection,
} from "../hooks/useHotelListParams";
import { useHotelListContext } from "../hooks/useHotelListParams";

const SORT_OPTIONS: SortOption[] = [
	{ label: "Date (récent)", value: "updatedAt:desc" },
	{ label: "Date (ancien)", value: "updatedAt:asc" },
	{ label: "Nom (A → Z)", value: "name:asc" },
	{ label: "Nom (Z → A)", value: "name:desc" },
];

export default function HotelSortSelect() {
	const { params, setSort } = useHotelListContext();
	const currentValue = `${params.sort.field}:${params.sort.direction}`;

	return (
		<SortSelect
			options={SORT_OPTIONS}
			value={currentValue}
			onChange={(value) => {
				const [f, d] = value.split(":") as [HotelSortField, SortDirection];
				setSort(f, d);
			}}
		/>
	);
}
