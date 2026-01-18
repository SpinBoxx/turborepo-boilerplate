import type {
	CreateHotelInput,
	GetHotelInput,
	ListHotelsInput,
	UpdateHotelInput,
} from "@zanadeal/api/contracts";
import { orpc } from "@/lib/orpc";

export async function getHotelById(input: GetHotelInput) {
	return orpc.hotel.get({ id: input.id });
}

export async function listHotels(input: ListHotelsInput = {}) {
	return orpc.hotel.list(input);
}

export async function createHotel(input: CreateHotelInput) {
	return orpc.hotel.create(input);
}

export async function updateHotel(input: UpdateHotelInput) {
	return orpc.hotel.updateHotel(input);
}
