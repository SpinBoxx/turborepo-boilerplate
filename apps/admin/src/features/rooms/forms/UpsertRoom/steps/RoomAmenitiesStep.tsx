import { useStore } from "@tanstack/react-form";
import type { Amenity } from "@zanadeal/api/contracts";
import { Loader2 } from "lucide-react";
import { useAmenities } from "@/features/amenity/amenity.queries";
import AmenityCard from "@/features/amenity/ui/AmenityCard";
import AmenityEmptyState from "@/features/amenity/ui/AmenityEmptyState";
import { withForm } from "@/hooks/useAppForm";
import { ROOM_UPSERT_DEFAULT_VALUES } from "../upsertRoom.config";

const RoomAmenitiesFormStep = withForm({
	defaultValues: ROOM_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		const { data: amenities, isPending, isError } = useAmenities({ take: 100 });
		// const selectedIds = form.getFieldValue("amenityIds") ?? [];
		const selectedIds = useStore(
			form.store,
			(state) => state.values.amenityIds ?? [],
		);
		const toggleAmenity = (amenityId: string) => {
			const current = form.getFieldValue("amenityIds") ?? [];
			const isSelected = current.includes(amenityId);
			const updated = isSelected
				? current.filter((id: string) => id !== amenityId)
				: [...current, amenityId];
			form.setFieldValue("amenityIds", updated);
			console.log(form.getFieldValue("amenityIds"));
		};

		if (isPending) {
			return (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			);
		}

		if (isError) {
			return (
				<div className="py-8 text-center text-destructive">
					Erreur lors du chargement des services.
				</div>
			);
		}

		if (!amenities || amenities.length === 0) {
			return <AmenityEmptyState />;
		}

		return (
			<div className="w-full space-y-4">
				<p className="text-muted-foreground text-sm">
					Sélectionnez les services disponibles dans cet hôtel.
				</p>
				<p className="text-muted-foreground text-xs">
					{selectedIds.length} service{selectedIds.length > 1 ? "s" : ""}{" "}
					sélectionné{selectedIds.length > 1 ? "s" : ""}
				</p>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{amenities.map((amenity: Amenity) => (
						<AmenityCard
							size={"sm"}
							key={amenity.id}
							amenity={amenity}
							isSelected={selectedIds.includes(amenity.id)}
							onClick={() => toggleAmenity(amenity.id)}
						/>
					))}
				</div>
			</div>
		);
	},
});

export default RoomAmenitiesFormStep;
