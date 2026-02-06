import type {
	DeleteHotelInput,
	GetHotelInput,
	ListHotelsInput,
	UpsertHotelInput,
} from "@zanadeal/api/features/hotel/schemas/hotel.schema";
import { orpc } from "@/lib/orpc";

export async function getHotelById(input: GetHotelInput) {
	return orpc.hotel.get({ id: input.id });
}

export async function listHotels(input: ListHotelsInput = {}) {
	return orpc.hotel.list(input);
}

export async function createHotel(input: UpsertHotelInput) {
	return orpc.hotel.create(input);
}

export async function updateHotel(
	hotelId: string,
	input: Partial<UpsertHotelInput>,
) {
	return orpc.hotel.update({ id: hotelId, ...input });
}

export async function deleteHotel(input: DeleteHotelInput) {
	return orpc.hotel.delete(input);
}
