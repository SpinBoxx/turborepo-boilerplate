import { Button } from "@zanadeal/ui";
import { LayoutGrid, List } from "lucide-react";
import { useHotelListContext } from "../hooks/useHotelListParams";

export default function HotelViewToggle() {
	const { viewMode, setViewMode } = useHotelListContext();
	return (
		<div className="inline-flex items-center gap-1 rounded-md border p-1">
			<Button
				type="button"
				variant={viewMode === "grid" ? "secondary" : "ghost"}
				size="icon"
				onClick={() => setViewMode("grid")}
				className="h-9 w-9"
			>
				<LayoutGrid className="size-4" />
				<span className="sr-only">Affichage grille</span>
			</Button>
			<Button
				type="button"
				variant={viewMode === "list" ? "secondary" : "ghost"}
				size="icon"
				onClick={() => setViewMode("list")}
				className="h-9 w-9"
			>
				<List className="size-4" />
				<span className="sr-only">Affichage liste</span>
			</Button>
		</div>
	);
}
