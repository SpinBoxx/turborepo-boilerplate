import type { Amenity } from "@zanadeal/api/features/amenity/amenity.schemas";
import { Button, Spinner } from "@zanadeal/ui";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import H1 from "@/components/H1";
import { useAmenities } from "./amenity.queries";
import AmenityUpsertDialog from "./forms/AmenityUpsertDialog";
import AmenityCard from "./ui/AmenityCard";
import AmenityDeleteAlertDialog from "./ui/AmenityDeleteAlertDialog";
import AmenityEmptyState from "./ui/AmenityEmptyState";

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

export default function AmenityPage() {
	const { data, isPending, isError, error } = useAmenities({ take: 100 });
	const [upsertOpen, setUpsertOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [selected, setSelected] = useState<Amenity | null>(null);

	const amenities = useMemo(() => data ?? [], [data]);
	const errorMessage = useMemo(() => getErrorMessage(error), [error]);

	useEffect(() => {
		if (!isError) return;
		toast.error("Impossible de charger les services", {
			description: errorMessage,
		});
	}, [isError, errorMessage]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<H1>Services</H1>
					<p className="text-muted-foreground">
						Gestion des services et équipements hôteliers.
					</p>
				</div>
				<Button
					onClick={() => {
						setSelected(null);
						setUpsertOpen(true);
					}}
					className="w-full sm:w-auto"
				>
					<Plus className="size-4" />
					Nouveau
				</Button>
			</div>

			{isPending ? (
				<div className="flex items-center justify-center py-12">
					<Spinner />
				</div>
			) : isError ? (
				<div className="text-destructive text-sm">{errorMessage}</div>
			) : amenities.length === 0 ? (
				<AmenityEmptyState />
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{amenities.map((amenity) => (
						<AmenityCard
							size={"sm"}
							key={amenity.id}
							amenity={amenity}
							onEdit={() => {
								setSelected(amenity);
								setUpsertOpen(true);
							}}
							onDelete={() => {
								setSelected(amenity);
								setDeleteOpen(true);
							}}
						/>
					))}
				</div>
			)}

			<AmenityUpsertDialog
				open={upsertOpen}
				onOpenChange={setUpsertOpen}
				amenity={selected}
			/>

			<AmenityDeleteAlertDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				amenity={selected}
			/>
		</div>
	);
}
