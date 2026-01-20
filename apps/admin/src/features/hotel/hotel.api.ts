import type {
	CreateHotelInput,
	GetHotelInput,
	ListHotelsInput,
	ToggleHotelArchivedInput,
	UpdateHotelInput,
} from "@zanadeal/api/contracts";
import type { DeleteHotelInput } from "@zanadeal/api/features/hotel/hotel.schemas";
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

export async function archiveHotel(input: ToggleHotelArchivedInput) {
	return orpc.hotel.toggleArchived(input);
}

export async function deleteHotel(input: DeleteHotelInput) {
	return orpc.hotel.deleteHotel(input);
}
