import type { ContactMessageComputed } from "@zanadeal/api/features/contact-message";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@zanadeal/ui";
import { Eye, Trash2 } from "lucide-react";
import { ContactMessageStatusBadge } from "./ContactMessageStatusBadge";

function formatDate(value: Date | string) {
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function getMessagePreview(message: string) {
	return message.length > 96 ? `${message.slice(0, 96)}...` : message;
}

export function ContactMessagesTable({
	messages,
	onDeleteMessage,
	onOpenMessage,
}: {
	messages: ContactMessageComputed[];
	onDeleteMessage: (message: ContactMessageComputed) => void;
	onOpenMessage: (message: ContactMessageComputed) => void;
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Reçu le</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Expéditeur</TableHead>
					<TableHead>Objet</TableHead>
					<TableHead>Message</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{messages.map((message) => (
					<TableRow key={message.id}>
						<TableCell className="whitespace-nowrap text-muted-foreground text-sm">
							{formatDate(message.createdAt)}
						</TableCell>
						<TableCell>
							<ContactMessageStatusBadge status={message.status} />
						</TableCell>
						<TableCell>
							<div className="min-w-40 space-y-1">
								<p className="font-medium">{message.name}</p>
								<p className="text-muted-foreground text-sm">{message.email}</p>
							</div>
						</TableCell>
						<TableCell className="max-w-56 font-medium">
							{message.subject}
						</TableCell>
						<TableCell className="max-w-md text-muted-foreground text-sm">
							{getMessagePreview(message.message)}
						</TableCell>
						<TableCell>
							<div className="flex justify-end gap-1">
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Ouvrir le message"
									onClick={() => onOpenMessage(message)}
								>
									<Eye className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									className="text-destructive hover:text-destructive"
									aria-label="Supprimer le message"
									onClick={() => onDeleteMessage(message)}
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
