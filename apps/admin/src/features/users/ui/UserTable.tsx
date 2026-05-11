import type { ManagedUser } from "@zanadeal/api/features/user";
import {
	Badge,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@zanadeal/ui";
import { Pencil, UserX } from "lucide-react";

function formatDate(value: Date | string) {
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
	}).format(new Date(value));
}

function getBusinessRole(user: ManagedUser) {
	return user.roles.includes("ADMIN") ? "ADMIN" : "HOTEL_REVIEWER";
}

export default function UserTable({
	users,
	onEdit,
	onDeactivate,
}: {
	users: ManagedUser[];
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
							<Badge variant="secondary">{getBusinessRole(user)}</Badge>
						</TableCell>
						<TableCell>
							{user.disabledAt ? (
								<Badge variant="destructive">Désactivé</Badge>
							) : (
								<Badge>Actif</Badge>
							)}
						</TableCell>
						<TableCell>{formatDate(user.createdAt)}</TableCell>
						<TableCell>
							<div className="flex justify-end gap-2">
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
									disabled={!!user.disabledAt}
									onClick={() => onDeactivate(user)}
								>
									<UserX className="size-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
