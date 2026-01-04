import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateHotelInput } from "@zanadeal/api/contracts";
import { createHotel, getHotelById } from "./hotel.api";

export function hotelKeys() {
	return {
		all: ["hotel"] as const,
		byId: (id: string) => ["hotel", "byId", id] as const,
	};
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
		onSuccess: (hotel) => {
			queryClient.setQueryData(hotelKeys().byId(hotel.id), hotel);
		},
	});
}
