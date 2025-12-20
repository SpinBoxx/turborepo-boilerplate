import { orpc } from "../../lib/orpc";

import type { CreateHotelInput } from "./hotel.schemas";

export async function getHotelById(id: number) {
	return orpc.hotel.get({ id });
}

export async function createHotel(input: CreateHotelInput) {
	return orpc.hotel.create(input);
}
