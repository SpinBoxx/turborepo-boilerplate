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
import { UserX } from "lucide-react";
import { useEffect } from "react";
import { useDeactivateManagedUser } from "../users.queries";

export default function UserDeactivateAlertDialog({
	open,
	onOpenChange,
	user,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: ManagedUser | null;
}) {
	const mutation = useDeactivateManagedUser();

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
					<AlertDialogTitle>Désactiver cet utilisateur ?</AlertDialogTitle>
					<AlertDialogDescription>
						Le compte {user?.email ?? ""} ne pourra plus accéder à l'admin. Ses
						sessions actives seront détruites.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={mutation.isPending}>
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							disabled={
								mutation.isPending || user == null || !!user?.disabledAt
							}
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
							<UserX className="size-4" />
							Désactiver
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
