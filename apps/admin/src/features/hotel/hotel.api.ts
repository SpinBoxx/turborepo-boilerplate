import type { CreateHotelInput, GetHotelInput } from "@zanadeal/api/contracts";
import { orpc } from "@/lib/orpc";

export async function getHotelById(input: GetHotelInput) {
	return orpc.hotel.get({ id: input.id });
}

export async function createHotel(input: CreateHotelInput) {
	return orpc.hotel.create(input);
}
