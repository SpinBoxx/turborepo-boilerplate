import type { ContactMessageComputed } from "@zanadeal/api/features/contact-message";
import { Badge } from "@zanadeal/ui";

type ContactMessageStatus = ContactMessageComputed["status"];

const statusLabels: Record<ContactMessageStatus, string> = {
	NEW: "Nouveau",
	READ: "Lu",
	RESOLVED: "Traité",
};

export function ContactMessageStatusBadge({
	status,
}: {
	status: ContactMessageStatus;
}) {
	if (status === "NEW") return <Badge>{statusLabels[status]}</Badge>;
	if (status === "RESOLVED") {
		return <Badge variant="secondary">{statusLabels[status]}</Badge>;
	}

	return <Badge variant="outline">{statusLabels[status]}</Badge>;
}
