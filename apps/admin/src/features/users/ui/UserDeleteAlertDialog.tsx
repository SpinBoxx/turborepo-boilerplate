import type { ManagedUser } from "@zanadeal/api/features/user";
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
import { useDeleteManagedUser } from "../users.queries";

export default function UserDeleteAlertDialog({
	open,
	onOpenChange,
	user,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: ManagedUser | null;
}) {
	const mutation = useDeleteManagedUser();

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
					<AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Le compte{" "}
						<span className="font-medium">{user?.email ?? "sélectionné"}</span>,
						ses sessions et ses accès seront supprimés définitivement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={mutation.isPending}>
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							type="button"
							disabled={mutation.isPending || user == null}
							className={cn(
								"gap-2",
								mutation.isPending && "pointer-events-none",
							)}
							variant="destructive"
							onClick={async () => {
								if (!user) return;

								try {
									await mutation.mutateAsync({ id: user.id });
									onOpenChange(false);
								} catch {
									// toast handled by mutation hook
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
