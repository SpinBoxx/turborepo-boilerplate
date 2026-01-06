import type {
	CreateAmenityInput,
	DeleteAmenityInput,
	GetAmenityInput,
	ListAmenitiesInput,
	UpdateAmenityInput,
} from "@zanadeal/api/contracts";
import { orpc } from "@/lib/orpc";

export async function listAmenities({ cursor, take }: ListAmenitiesInput) {
	return orpc.amenity.list({ cursor, take });
}

export async function getAmenity({ id }: GetAmenityInput) {
	return orpc.amenity.get({ id });
}

export async function createAmenity(input: CreateAmenityInput) {
	return orpc.amenity.create(input);
}

export async function updateAmenity(input: UpdateAmenityInput) {
	return orpc.amenity.update(input);
}

export async function deleteAmenity({ id }: DeleteAmenityInput) {
	return orpc.amenity.delete({ id });
}
