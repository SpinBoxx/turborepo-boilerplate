import type { Hotel } from "@zanadeal/api/contracts";
import { Button, cn, Spinner } from "@zanadeal/ui";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import H1 from "@/components/H1";
import { useHotels } from "./hotel.queries";
import HotelCard from "./ui/HotelCard";
import HotelEmptyState from "./ui/HotelEmptyState";
import HotelRow from "./ui/HotelRow";
import HotelUpsertDialog from "./ui/HotelUpsertDialog";

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

type ViewMode = "grid" | "list";

export default function HotelsPage() {
	const { data, isPending, isError, error } = useHotels({ take: 100 });
	const [upsertOpen, setUpsertOpen] = useState(false);
	const [selected, setSelected] = useState<Hotel | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const hotels = useMemo(() => data ?? [], [data]);
	const errorMessage = useMemo(() => getErrorMessage(error), [error]);

	useEffect(() => {
		if (!isError) return;
		toast.error("Impossible de charger les hôtels", {
			description: errorMessage,
		});
	}, [isError, errorMessage]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<H1>Hôtels</H1>
					<p className="text-muted-foreground">
						Gérez votre portefeuille d’établissements : informations, services,
						coordonnées, photos et informations bancaires.
					</p>
				</div>

				<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
					<div className="ml-auto inline-flex w-fit items-center justify-between gap-1 rounded-md border p-1 sm:w-auto">
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

					<Button
						className="w-full gap-2 sm:w-auto"
						onClick={() => {
							setSelected(null);
							setUpsertOpen(true);
						}}
					>
						<Plus className="size-4" />
						Ajouter
					</Button>
				</div>
			</div>

			{isPending ? (
				<div className="flex items-center justify-center py-12">
					<Spinner />
				</div>
			) : isError ? (
				<div className="text-destructive text-sm">{errorMessage}</div>
			) : hotels.length === 0 ? (
				<HotelEmptyState />
			) : viewMode === "grid" ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{hotels.map((hotel) => (
						<HotelCard
							key={hotel.id}
							hotel={hotel}
							onClick={() => {
								setSelected(hotel);
								setUpsertOpen(true);
							}}
						/>
					))}
				</div>
			) : (
				<div className={cn("grid gap-3 md:grid-cols-2")}>
					{hotels.map((hotel) => (
						<HotelRow
							key={hotel.id}
							hotel={hotel}
							onClick={() => {
								console.log("selected", hotel);

								setSelected(hotel);
								setUpsertOpen(true);
							}}
						/>
					))}
				</div>
			)}

			<HotelUpsertDialog
				open={upsertOpen}
				onOpenChange={setUpsertOpen}
				hotel={selected}
			/>
		</div>
	);
}
