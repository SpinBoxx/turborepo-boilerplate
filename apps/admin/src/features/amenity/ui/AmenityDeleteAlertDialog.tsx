import type { Amenity } from "@zanadeal/api/contracts";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	cn,
} from "@zanadeal/ui";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDeleteAmenity } from "../amenity.queries";

export default function AmenityDeleteAlertDialog({
	open,
	onOpenChange,
	amenity,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	amenity: Amenity | null;
}) {
	const mutation = useDeleteAmenity();

	useEffect(() => {
		if (!open) mutation.reset();
	}, [open, mutation]);

	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				if (mutation.isPending) return;
				onOpenChange(next);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Le service{" "}
						<span className="font-medium">{amenity?.name ?? ""}</span> sera
						supprimé.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={mutation.isPending}>
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							disabled={mutation.isPending || amenity == null}
							className={cn(
								"gap-2",
								mutation.isPending && "pointer-events-none",
							)}
							variant="destructive"
							onClick={async () => {
								if (!amenity) return;
								try {
									await mutation.mutateAsync({ id: amenity.id });
									onOpenChange(false);
								} catch {
									// toast géré dans le hook de mutation
								}
							}}
						>
							<Trash2 className="size-4" />
							Supprimer
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
