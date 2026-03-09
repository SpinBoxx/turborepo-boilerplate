import SearchFilter from "@/components/SearchFilter";
import { useHotelListContext } from "../hooks/useHotelListParams";

export default function HotelSearchFilter() {
	const { setSearch } = useHotelListContext();
	return (
		<SearchFilter
			onSearch={setSearch}
			placeholder="Rechercher un hôtel..."
		/>
	);
}
