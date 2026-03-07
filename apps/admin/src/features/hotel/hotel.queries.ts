import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	DeleteHotelInput,
	ListHotelsInput,
	UpsertHotelInput,
} from "@zanadeal/api/features/hotel";
import { toast } from "sonner";
import { getErrorMessage } from "../amenity/amenity.queries";
import {
	createHotel,
	deleteHotel,
	getHotelById,
	listHotels,
	updateHotel,
} from "./hotel.api";

type ListHotelsClientInput = Omit<ListHotelsInput, "take" | "skip">;

export function hotelKeys() {
	return {
		all: ["hotel"] as const,
		list: (input: ListHotelsClientInput) => ["hotel", "list", input] as const,
		byId: (id: string) => ["hotel", "byId", id] as const,
	};
}

export function useHotels(input: ListHotelsClientInput) {
	return useQuery({
		queryKey: hotelKeys().list(input),
		queryFn: () => listHotels(input),
	});
}

export function useHotel(id: string | null) {
	return useQuery({
		queryKey: id ? hotelKeys().byId(id) : ["hotel", "byId", "null"],
		queryFn: () => {
			if (id == null) throw new Error("Missing hotel id");
			return getHotelById({ id });
		},
		enabled: id != null,
	});
}

export function useCreateHotel() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpsertHotelInput) => createHotel(input),
		onError: (error) => {
			toast.error("Création impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
			queryClient.invalidateQueries({ queryKey: hotelKeys().all });
			toast.success("Hôtel créé avec succès");
		},
	});
}

export function useUpdateHotel(hotelId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: Partial<UpsertHotelInput>) => {
			return updateHotel(hotelId, input);
		},
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
			queryClient.invalidateQueries({ queryKey: hotelKeys().all });
		},
	});
}

export function useDeleteHotel() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: DeleteHotelInput) => deleteHotel(input),
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
			queryClient.invalidateQueries({ queryKey: hotelKeys().all });
		},
		onError: (error) => {
			toast.error("Suppression impossible", {
				description: getErrorMessage(error),
			});
		},
	});
}
