import type {
	ListContactMessagesInput,
	UpdateContactMessageStatusInput,
} from "@zanadeal/api/features/contact-message";
import { orpc } from "@/lib/orpc";

export async function listContactMessages(
	input: ListContactMessagesInput = {},
) {
	return orpc.contactMessage.list(input);
}

export async function updateContactMessageStatus(
	input: UpdateContactMessageStatusInput,
) {
	return orpc.contactMessage.updateStatus(input);
}
