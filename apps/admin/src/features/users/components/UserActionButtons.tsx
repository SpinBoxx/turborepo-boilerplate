import type { ManagedUser } from "@zanadeal/api/features/user";
import { Button } from "@zanadeal/ui";
import { Pencil, Trash2, UserX } from "lucide-react";

export function UserActionButtons({
	user,
	currentUserId,
	onDeactivate,
	onDelete,
	onEdit,
}: {
	user: ManagedUser;
	currentUserId?: string;
	onDeactivate: (user: ManagedUser) => void;
	onDelete: (user: ManagedUser) => void;
	onEdit: (user: ManagedUser) => void;
}) {
	const isCurrentUser = user.id === currentUserId;

	return (
		<div className="flex justify-end gap-1">
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="Modifier l'utilisateur"
				onClick={() => onEdit(user)}
			>
				<Pencil className="size-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				aria-label="Désactiver l'utilisateur"
				disabled={!!user.disabledAt || isCurrentUser}
				onClick={() => onDeactivate(user)}
			>
				<UserX className="size-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				className="text-destructive hover:text-destructive"
				aria-label="Supprimer l'utilisateur"
				disabled={isCurrentUser}
				onClick={() => onDelete(user)}
			>
				<Trash2 className="size-4" />
			</Button>
		</div>
	);
}
