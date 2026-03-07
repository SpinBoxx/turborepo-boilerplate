import { useQuery } from "@tanstack/react-query";
import type { ListHotelsInput } from "@zanadeal/api/features/hotel";
import { getHotelById, listHotels } from "./hotel.api";

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
