import type { ManagedUser } from "@zanadeal/api/features/user";
import { Badge } from "@zanadeal/ui";

function getBusinessRole(user: ManagedUser) {
	return user.roles.includes("ADMIN") ? "ADMIN" : "HOTEL_REVIEWER";
}

export function UserRoleBadge({ user }: { user: ManagedUser }) {
	return <Badge variant="secondary">{getBusinessRole(user)}</Badge>;
}
