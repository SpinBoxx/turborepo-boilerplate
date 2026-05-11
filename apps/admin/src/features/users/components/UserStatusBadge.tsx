import type { ManagedUser } from "@zanadeal/api/features/user";
import { Badge } from "@zanadeal/ui";

export function UserStatusBadge({ user }: { user: ManagedUser }) {
	if (user.disabledAt) {
		return <Badge variant="destructive">Désactivé</Badge>;
	}

	return <Badge>Actif</Badge>;
}
