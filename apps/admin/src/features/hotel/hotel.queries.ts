import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateHotelInput,
	ListHotelsInput,
} from "@zanadeal/api/contracts";
import type {
	DeleteHotelInput,
	UpsertHotelInput,
} from "@zanadeal/api/features/hotel/schemas/hotel.schema";
import { toast } from "sonner";
import { getErrorMessage } from "../amenity/amenity.queries";
import {
	createHotel,
	deleteHotel,
	getHotelById,
	listHotels,
	updateHotel,
} from "./hotel.api";

export function hotelKeys() {
	return {
		all: ["hotel"] as const,
		list: (input: ListHotelsInput) =>
			["hotel", "list", input.cursor ?? null, input.take ?? null] as const,
		byId: (id: string) => ["hotel", "byId", id] as const,
	};
}

export function useHotels(input: ListHotelsInput = {}) {
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
		mutationFn: (input: CreateHotelInput) => createHotel(input),
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
