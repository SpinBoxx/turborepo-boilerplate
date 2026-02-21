import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	Amenity,
	CreateAmenityInput,
	DeleteAmenityInput,
	ListAmenitiesInput,
	UpdateAmenityInput,
} from "@zanadeal/api/contracts";
import { toast } from "sonner";
import {
	createAmenity,
	deleteAmenity,
	getAmenity,
	listAmenities,
	updateAmenity,
} from "./amenity.api";

export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	return "Une erreur inattendue est survenue.";
}

export function amenityKeys() {
	return {
		all: ["amenity"] as const,
		list: (input: ListAmenitiesInput) =>
			["amenity", "list", input.cursor ?? null, input.take ?? null] as const,
		byId: (id: string) => ["amenity", "byId", id] as const,
	};
}

export function useAmenities(input: ListAmenitiesInput = {}) {
	return useQuery({
		queryKey: amenityKeys().list(input),
		queryFn: () => listAmenities(input),
	});
}

export function useAmenity(id: string | null) {
	return useQuery({
		queryKey: id ? amenityKeys().byId(id) : ["amenity", "byId", "null"],
		queryFn: () => {
			if (id == null) throw new Error("Missing amenity id");
			return getAmenity({ id });
		},
		enabled: id != null,
	});
}

export function useCreateAmenity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateAmenityInput) => createAmenity(input),
		onError: (error) => {
			toast.error("Création impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: (amenity) => {
			queryClient.setQueryData(amenityKeys().byId(amenity.id), amenity);
			queryClient.invalidateQueries({ queryKey: amenityKeys().all });
		},
	});
}

export function useUpdateAmenity(id: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateAmenityInput) => updateAmenity({ id, ...input }),
		onError: (error) => {
			toast.error("Modification impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: (amenity) => {
			queryClient.setQueryData(amenityKeys().byId(amenity.id), amenity);
			queryClient.invalidateQueries({ queryKey: amenityKeys().all });
		},
	});
}

export function useDeleteAmenity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: DeleteAmenityInput) => deleteAmenity(input),
		onError: (error) => {
			toast.error("Suppression impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: (amenity) => {
			queryClient.removeQueries({ queryKey: amenityKeys().byId(amenity.id) });
			queryClient.invalidateQueries({ queryKey: amenityKeys().all });
		},
	});
}

export function isAmenityEqual(a: Amenity, b: Amenity) {
	return a.id === b.id && a.name === b.name && a.icon === b.icon;
}
