import type { ManagedUser } from "@zanadeal/api/features/user";
import { Button, Spinner } from "@zanadeal/ui";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import H1 from "@/components/H1";
import UserUpsertDialog from "./forms/UserUpsertDialog";
import UserDeactivateAlertDialog from "./ui/UserDeactivateAlertDialog";
import UserTable from "./ui/UserTable";
import { getErrorMessage, useManagedUsers } from "./users.queries";

export default function UsersPage() {
	const { data, isPending, isError, error } = useManagedUsers();
	const [upsertOpen, setUpsertOpen] = useState(false);
	const [deactivateOpen, setDeactivateOpen] = useState(false);
	const [selected, setSelected] = useState<ManagedUser | null>(null);

	const users = useMemo(() => data ?? [], [data]);
	const errorMessage = useMemo(() => getErrorMessage(error), [error]);

	useEffect(() => {
		if (!isError) return;
		toast.error("Impossible de charger les utilisateurs", {
			description: errorMessage,
		});
	}, [isError, errorMessage]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<H1>Utilisateurs</H1>
					<p className="text-muted-foreground">
						Gestion des comptes admin et hotel reviewer.
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
			) : users.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
					Aucun utilisateur admin ou hotel reviewer.
				</div>
			) : (
				<UserTable
					users={users}
					onEdit={(user) => {
						setSelected(user);
						setUpsertOpen(true);
					}}
					onDeactivate={(user) => {
						setSelected(user);
						setDeactivateOpen(true);
					}}
				/>
			)}

			<UserUpsertDialog
				open={upsertOpen}
				onOpenChange={setUpsertOpen}
				user={selected}
			/>

			<UserDeactivateAlertDialog
				open={deactivateOpen}
				onOpenChange={setDeactivateOpen}
				user={selected}
			/>
		</div>
	);
}
