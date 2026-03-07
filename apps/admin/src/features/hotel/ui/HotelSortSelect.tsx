import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zanadeal/ui";
import type {
	HotelSortField,
	SortDirection,
} from "../hooks/useHotelListParams";
import { useHotelListContext } from "../hooks/useHotelListParams";

// ─── Sort options ───────────────────────────────────────────────────

interface SortOption {
	label: string;
	field: HotelSortField;
	direction: SortDirection;
}

const SORT_OPTIONS: SortOption[] = [
	{ label: "Date (récent)", field: "updatedAt", direction: "desc" },
	{ label: "Date (ancien)", field: "updatedAt", direction: "asc" },
	{ label: "Nom (A → Z)", field: "name", direction: "asc" },
	{ label: "Nom (Z → A)", field: "name", direction: "desc" },
];

// ─── Component ──────────────────────────────────────────────────────

export default function HotelSortSelect() {
	const { params, setSort } = useHotelListContext();
	const { field, direction } = params.sort;
	const currentValue = `${field}:${direction}`;

	return (
		<Select
			value={currentValue}
			onValueChange={(value) => {
				const [f, d] = value.split(":") as [HotelSortField, SortDirection];
				setSort(f, d);
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Trier par..." />
			</SelectTrigger>
			<SelectContent>
				{SORT_OPTIONS.map((option) => (
					<SelectItem
						key={`${option.field}:${option.direction}`}
						value={`${option.field}:${option.direction}`}
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
