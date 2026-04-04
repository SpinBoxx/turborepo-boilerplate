import type {
	GetHotelInput,
	ListHotelsInput,
} from "@zanadeal/api/features/hotel";
import { orpc } from "@/lib/orpc";

export async function getHotelById(input: GetHotelInput) {
	return orpc.hotel.get(input);
}

export async function listHotels(input: ListHotelsInput) {
	return orpc.hotel.list(input);
}
