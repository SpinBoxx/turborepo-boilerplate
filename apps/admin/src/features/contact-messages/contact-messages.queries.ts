import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	DeleteContactMessageInput,
	ListContactMessagesInput,
	UpdateContactMessageStatusInput,
} from "@zanadeal/api/features/contact-message";
import { toast } from "sonner";
import {
	deleteContactMessage,
	listContactMessages,
	updateContactMessageStatus,
} from "./contact-messages.api";

export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

export function contactMessageKeys() {
	return {
		all: ["contact-messages"] as const,
		lists: () => ["contact-messages", "list"] as const,
		list: (input: ListContactMessagesInput) =>
			["contact-messages", "list", input] as const,
	};
}

export function useContactMessages(input: ListContactMessagesInput = {}) {
	return useQuery({
		queryKey: contactMessageKeys().list(input),
		queryFn: () => listContactMessages(input),
	});
}

export function useUpdateContactMessageStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateContactMessageStatusInput) =>
			updateContactMessageStatus(input),
		onError: (error) => {
			toast.error("Mise à jour impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: contactMessageKeys().all });
			toast.success("Message mis à jour");
		},
	});
}

export function useDeleteContactMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: DeleteContactMessageInput) =>
			deleteContactMessage(input),
		onError: (error) => {
			toast.error("Suppression impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: contactMessageKeys().all });
			toast.success("Message supprimé");
		},
	});
}
