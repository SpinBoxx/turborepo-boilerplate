import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateHotelInput,
	ListHotelsInput,
	ToggleHotelArchivedInput,
	UpdateHotelInput,
} from "@zanadeal/api/contracts";
import type { DeleteHotelInput } from "@zanadeal/api/features/hotel/hotel.schemas";
import { toast } from "sonner";
import { getErrorMessage } from "../amenity/amenity.queries";
import {
	archiveHotel,
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
			console.log(error);

			toast.error("Modification impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
			queryClient.invalidateQueries({ queryKey: hotelKeys().all });
			toast.success("Hotel created successfully");
		},
	});
}

export function useUpdateHotel() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: UpdateHotelInput) => updateHotel(input),
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
			queryClient.invalidateQueries({ queryKey: hotelKeys().all });
		},
	});
}

export function useArchiveHotel() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: ToggleHotelArchivedInput) => archiveHotel(input),
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
			queryClient.invalidateQueries({ queryKey: hotelKeys().all });
			if (hotel.isArchived) {
				toast.success("Hotel archived successfully", {
					description: "Hotel can no longer be booked",
				});
			} else {
				toast.success("Hotel unarchived successfully", {
					description: "Hotel can now be booked",
				});
			}
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
