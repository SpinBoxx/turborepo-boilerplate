import type { HotelAdminComputed } from "@zanadeal/api/features/hotel";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import H1 from "@/components/H1";
import {
	HotelListProvider,
	useHotelListContext,
} from "./hooks/useHotelListParams";
import HotelList from "./ui/HotelList";
import HotelToolbar from "./ui/HotelToolbar";
import HotelUpsertDialog from "./ui/HotelUpsertDialog";

export default function HotelsPage() {
	return (
		<HotelListProvider>
			<HotelsPageContent />
		</HotelListProvider>
	);
}

function HotelsPageContent() {
	const { isError, errorMessage } = useHotelListContext();

	const [upsertOpen, setUpsertOpen] = useState(false);
	const [selected, setSelected] = useState<HotelAdminComputed | null>(null);

	useEffect(() => {
		if (!isError) return;
		toast.error("Impossible de charger les hôtels", {
			description: errorMessage,
		});
	}, [isError, errorMessage]);

	const handleHotelClick = (hotel: HotelAdminComputed) => {
		setSelected(hotel);
		setUpsertOpen(true);
	};

	const handleAdd = () => {
		setSelected(null);
		setUpsertOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<H1>Hôtels</H1>
				<p className="text-muted-foreground">
					Gérez votre portefeuille d'établissements : informations, services,
					coordonnées, photos et informations bancaires.
				</p>
			</div>

			<HotelToolbar onAdd={handleAdd} />

			<HotelList onHotelClick={handleHotelClick} />

			<HotelUpsertDialog
				open={upsertOpen}
				onOpenChange={setUpsertOpen}
				hotel={selected}
			/>
		</div>
	);
}
