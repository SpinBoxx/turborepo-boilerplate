import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateManagedUserInput,
	DeactivateManagedUserInput,
	UpdateManagedUserInput,
} from "@zanadeal/api/features/user";
import { toast } from "sonner";
import {
	createManagedUser,
	deactivateManagedUser,
	listManagedUsers,
	updateManagedUser,
} from "./users.api";

export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

export function userKeys() {
	return {
		all: ["users"] as const,
		managed: ["users", "managed"] as const,
	};
}

export function useManagedUsers() {
	return useQuery({
		queryKey: userKeys().managed,
		queryFn: listManagedUsers,
	});
}

export function useCreateManagedUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateManagedUserInput) => createManagedUser(input),
		onError: (error) => {
			toast.error("Création impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys().all });
			toast.success("Utilisateur créé");
		},
	});
}

export function useUpdateManagedUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateManagedUserInput) => updateManagedUser(input),
		onError: (error) => {
			toast.error("Modification impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys().all });
			toast.success("Utilisateur modifié");
		},
	});
}

export function useDeactivateManagedUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: DeactivateManagedUserInput) =>
			deactivateManagedUser(input),
		onError: (error) => {
			toast.error("Désactivation impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys().all });
			toast.success("Utilisateur désactivé");
		},
	});
}
