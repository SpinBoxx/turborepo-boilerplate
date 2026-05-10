import type { ContactMessageComputed } from "@zanadeal/api/features/contact-message";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@zanadeal/ui";
import { Check, CheckCheck, Mail, Send } from "lucide-react";
import { useUpdateContactMessageStatus } from "../contact-messages.queries";
import { ContactMessageStatusBadge } from "./ContactMessageStatusBadge";

function formatDate(value: Date | string | null) {
	if (!value) return "-";
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function buildReplyHref(message: ContactMessageComputed) {
	const subject = encodeURIComponent(`Re: ${message.subject}`);
	const body = encodeURIComponent(`Bonjour ${message.name},\n\n`);

	return `mailto:${message.email}?subject=${subject}&body=${body}`;
}

export function ContactMessageDetailDialog({
	open,
	onOpenChange,
	message,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	message: ContactMessageComputed | null;
}) {
	const mutation = useUpdateContactMessageStatus();

	const canMarkRead = message?.status === "NEW";
	const canResolve = message != null && message.status !== "RESOLVED";
	const replyHref = message ? buildReplyHref(message) : undefined;

	function handleOpenChange(next: boolean) {
		if (mutation.isPending) return;
		if (!next) mutation.reset();
		onOpenChange(next);
	}

	async function updateStatus(status: "READ" | "RESOLVED") {
		if (!message) return;
		try {
			await mutation.mutateAsync({ id: message.id, status });
			onOpenChange(false);
		} catch {
			// toast handled by mutation hook
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="space-y-2">
							<DialogTitle className="flex items-center gap-4">
								Message de contact
								{message ? (
									<ContactMessageStatusBadge status={message.status} />
								) : null}
							</DialogTitle>
							<DialogDescription>
								Consultez la demande et répondez directement depuis votre boite
								mail.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				{message && (
					<>
						<div className="mt-5 space-y-5">
							<section className="rounded-md border bg-muted/30 p-4">
								<div className="flex min-w-0 items-start gap-3">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
										<Mail className="size-4 text-muted-foreground" />
									</div>
									<div className="min-w-0 space-y-1">
										<p className="truncate font-medium">{message.name}</p>
										<a
											className="inline-flex max-w-full items-center gap-2 truncate text-muted-foreground text-sm hover:text-foreground"
											href={`mailto:${message.email}`}
										>
											<span className="truncate">{message.email}</span>
										</a>
									</div>
								</div>
							</section>

							<dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
								<div className="rounded-md border p-3">
									<dt className="text-muted-foreground">Reçu</dt>
									<dd className="mt-1 tabular-nums">
										{formatDate(message.createdAt)}
									</dd>
								</div>
								<div className="rounded-md border p-3">
									<dt className="text-muted-foreground">Lu</dt>
									<dd className="mt-1 tabular-nums">
										{formatDate(message.readAt)}
									</dd>
								</div>
								<div className="rounded-md border p-3">
									<dt className="text-muted-foreground">Traité</dt>
									<dd className="mt-1 tabular-nums">
										{formatDate(message.resolvedAt)}
									</dd>
								</div>
							</dl>

							<section className="space-y-2">
								<h3 className="text-balance font-semibold text-lg">
									{message.subject}
								</h3>
								<p className="whitespace-pre-wrap text-pretty rounded-md border bg-muted/30 p-4 text-sm leading-6">
									{message.message}
								</p>
							</section>
						</div>

						<DialogFooter className="mt-6 gap-2 sm:flex-row sm:justify-between">
							<Button asChild type="button" variant="outline">
								<a
									href={replyHref}
									aria-label={`Répondre par email à ${message.email}`}
								>
									<Send className="size-4" />
									Répondre
								</a>
							</Button>

							<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
								<Button
									type="button"
									variant="outline"
									disabled={!canMarkRead || mutation.isPending}
									onClick={() => updateStatus("READ")}
								>
									<Check className="size-4" />
									Marquer lu
								</Button>
								<Button
									type="button"
									disabled={!canResolve || mutation.isPending}
									onClick={() => updateStatus("RESOLVED")}
								>
									<CheckCheck className="size-4" />
									Marquer traité
								</Button>
							</div>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
