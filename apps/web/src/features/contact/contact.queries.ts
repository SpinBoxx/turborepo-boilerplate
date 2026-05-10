import { useMutation } from "@tanstack/react-query";
import type { CreateContactMessageInput } from "@zanadeal/api/features/contact-message";
import { createContactMessage } from "./contact.api";

export function contactKeys() {
	return {
		all: ["contact"] as const,
	};
}

export function useCreateContactMessage() {
	return useMutation({
		mutationFn: (input: CreateContactMessageInput) =>
			createContactMessage(input),
	});
}
