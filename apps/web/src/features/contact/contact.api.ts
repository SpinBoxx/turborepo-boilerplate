import type { CreateContactMessageInput } from "@zanadeal/api/features/contact-message";
import { orpc } from "@/lib/orpc";

export function createContactMessage(input: CreateContactMessageInput) {
	return orpc.contactMessage.create(input);
}
