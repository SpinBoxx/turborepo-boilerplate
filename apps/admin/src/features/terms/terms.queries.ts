import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateTermsInput,
	DeleteTermsInput,
	ListTermsInput,
	UpdateTermsInput,
} from "@zanadeal/api/contracts";
import { toast } from "sonner";
import { getErrorMessage } from "../amenity/amenity.queries";
import {
	createTerm,
	deleteTerm,
	getTermById,
	listTerms,
	updateTerm,
} from "./terms.api";

export function termsKeys() {
	return {
		all: ["terms"] as const,
		byId: (id: string) => ["terms", "byId", id] as const,
	};
}

export function useTerm(id: string | null) {
	return useQuery({
		queryKey: id ? termsKeys().byId(id) : ["terms", "byId", "null"],
		queryFn: () => {
			if (id == null) throw new Error("Missing term id");
			return getTermById({ id });
		},
		enabled: id != null,
	});
}

export function useListTerms(input: ListTermsInput) {
	return useQuery({
		queryKey: termsKeys().all,
		queryFn: () => listTerms(input),
		enabled: true,
	});
}

export function useCreateTerm() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateTermsInput) => createTerm(input),
		onError: (error) => {
			toast.error("Création impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: (term) => {
			queryClient.setQueryData(termsKeys().byId(term.id), term);
			queryClient.invalidateQueries({ queryKey: termsKeys().all });
			toast.success("Condition générale créée avec succès");
		},
	});
}

export function useDeleteTerm() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: DeleteTermsInput) => deleteTerm(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: termsKeys().all });
		},
		onError: (error) => {
			toast.error("Suppression impossible", {
				description: getErrorMessage(error),
			});
		},
	});
}

export function useUpdateTerm() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateTermsInput) => updateTerm(input),
		onSuccess: (term) => {
			queryClient.setQueryData(termsKeys().byId(term.id), term);
			queryClient.invalidateQueries({ queryKey: termsKeys().all });
		},
		onError: (error) => {
			toast.error("Modification impossible", {
				description: getErrorMessage(error),
			});
		},
	});
}
