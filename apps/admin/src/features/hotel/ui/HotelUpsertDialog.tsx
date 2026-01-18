import type { Hotel } from "@zanadeal/api/contracts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@zanadeal/ui";
import HotelUpsertForm from "../forms/UpsertForm/HotelUpsertForm";

export default function HotelUpsertDialog({
	open,
	onOpenChange,
	hotel,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	hotel: Hotel | null;
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				onOpenChange(next);
			}}
		>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader className="border-b pb-2">
					<DialogTitle>Ajouter un hotel</DialogTitle>
				</DialogHeader>
				<HotelUpsertForm hotel={hotel} className="mt-2" />
			</DialogContent>
		</Dialog>
	);
}
