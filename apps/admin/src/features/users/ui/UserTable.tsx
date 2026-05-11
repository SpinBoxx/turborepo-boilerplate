import type { ManagedUser } from "@zanadeal/api/features/user";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@zanadeal/ui";
import { UserActionButtons } from "../components/UserActionButtons";
import { UserRoleBadge } from "../components/UserRoleBadge";
import { UserStatusBadge } from "../components/UserStatusBadge";

function formatDate(value: Date | string) {
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
	}).format(new Date(value));
}

export default function UserTable({
	currentUserId,
	users,
	onDelete,
	onEdit,
	onDeactivate,
}: {
	currentUserId?: string;
	users: ManagedUser[];
	onDelete: (user: ManagedUser) => void;
	onEdit: (user: ManagedUser) => void;
	onDeactivate: (user: ManagedUser) => void;
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Utilisateur</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Rôle</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Créé le</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell className="font-medium">
							{user.firstName} {user.lastName}
						</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>
							<UserRoleBadge user={user} />
						</TableCell>
						<TableCell>
							<UserStatusBadge user={user} />
						</TableCell>
						<TableCell>{formatDate(user.createdAt)}</TableCell>
						<TableCell>
							<UserActionButtons
								currentUserId={currentUserId}
								onDeactivate={onDeactivate}
								onDelete={onDelete}
								onEdit={onEdit}
								user={user}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
