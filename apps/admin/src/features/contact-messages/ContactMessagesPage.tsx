import type { ContactMessageComputed } from "@zanadeal/api/features/contact-message";
import { Spinner } from "@zanadeal/ui";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import H1 from "@/components/H1";
import {
	getErrorMessage,
	useContactMessages,
} from "./contact-messages.queries";
import { ContactMessageDeleteAlertDialog } from "./ui/ContactMessageDeleteAlertDialog";
import { ContactMessageDetailDialog } from "./ui/ContactMessageDetailDialog";
import { ContactMessagesTable } from "./ui/ContactMessagesTable";

export default function ContactMessagesPage() {
	const { data, isPending, isError, error } = useContactMessages();
	const [selectedMessage, setSelectedMessage] =
		useState<ContactMessageComputed | null>(null);
	const [messageToDelete, setMessageToDelete] =
		useState<ContactMessageComputed | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const messages = useMemo(() => data ?? [], [data]);
	const errorMessage = useMemo(() => getErrorMessage(error), [error]);

	useEffect(() => {
		if (!isError) return;
		toast.error("Impossible de charger les messages", {
			description: errorMessage,
		});
	}, [isError, errorMessage]);

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<H1>Messages</H1>
				<p className="text-muted-foreground">
					Demandes envoyées depuis le formulaire de contact public.
				</p>
			</div>

			{isPending ? (
				<div className="flex items-center justify-center py-12">
					<Spinner />
				</div>
			) : isError ? (
				<div className="text-destructive text-sm">{errorMessage}</div>
			) : messages.length === 0 ? (
				<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
					Aucun message de contact pour le moment.
				</div>
			) : (
				<ContactMessagesTable
					messages={messages}
					onDeleteMessage={(message) => {
						setMessageToDelete(message);
						setDeleteOpen(true);
					}}
					onOpenMessage={(message) => {
						setSelectedMessage(message);
						setDetailOpen(true);
					}}
				/>
			)}

			<ContactMessageDetailDialog
				open={detailOpen}
				onOpenChange={setDetailOpen}
				message={selectedMessage}
			/>
			<ContactMessageDeleteAlertDialog
				open={deleteOpen}
				onOpenChange={(next) => {
					setDeleteOpen(next);
					if (!next) setMessageToDelete(null);
				}}
				message={messageToDelete}
				onDeleted={() => {
					if (messageToDelete?.id === selectedMessage?.id) {
						setDetailOpen(false);
						setSelectedMessage(null);
					}
				}}
			/>
		</div>
	);
}
