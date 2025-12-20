import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHotel, getHotelById } from "./hotel.api";
import type { CreateHotelInput } from "./hotel.schemas";

export function hotelKeys() {
	return {
		all: ["hotel"] as const,
		byId: (id: number) => ["hotel", "byId", id] as const,
	};
}

export function useHotel(id: number | null) {
	return useQuery({
		queryKey: id ? hotelKeys().byId(id) : ["hotel", "byId", "null"],
		queryFn: () => {
			if (id == null) throw new Error("Missing hotel id");
			return getHotelById(id);
		},
		enabled: id != null,
	});
}

export function useCreateHotel() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateHotelInput) => createHotel(input),
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
		},
	});
}
