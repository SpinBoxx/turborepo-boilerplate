import type { ContactMessageComputed } from "@zanadeal/api/features/contact-message";
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
import { useDeleteContactMessage } from "../contact-messages.queries";

export function ContactMessageDeleteAlertDialog({
	open,
	onOpenChange,
	message,
	onDeleted,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	message: ContactMessageComputed | null;
	onDeleted: () => void;
}) {
	const mutation = useDeleteContactMessage();

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
					<AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible. Le message de{" "}
						<span className="font-medium">
							{message?.email ?? "cet expéditeur"}
						</span>{" "}
						sera supprimé définitivement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={mutation.isPending}>
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							type="button"
							disabled={mutation.isPending || message == null}
							className={cn(
								"gap-2",
								mutation.isPending && "pointer-events-none",
							)}
							variant="destructive"
							onClick={async () => {
								if (!message) return;

								try {
									await mutation.mutateAsync({ id: message.id });
									onOpenChange(false);
									onDeleted();
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
