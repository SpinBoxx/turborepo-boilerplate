import { ORPCError } from "@orpc/client";

import { uploadBase64Image } from "../../../cloudinary/cloudinary.upload.service";
import type {
	UpsertRoomComputedInput,
	UpsertRoomInput,
} from "../schemas/room.schemas";

const computeRoomImages = async (
	images: UpsertRoomInput["images"],
	room: UpsertRoomInput | (Partial<UpsertRoomInput> & { id: string }),
): Promise<UpsertRoomComputedInput["images"]> => {
	if (!images?.length) return [];

	return Promise.all(
		images.map(async (image, index) => {
			const result = await uploadBase64Image(image.base64, {
				folder: `hotels/${room.hotelId}/rooms/${room.title}`,
			});

			if (!result.success) {
				throw new ORPCError("UPLOAD_FAILED", {
					status: 400,
					message: `Cannot upload image number ${index + 1}`,
				});
			}
			return result;
		}),
	);
};

const computedStringToNumbers = (input: Partial<UpsertRoomInput>) => {
	const { areaM2, baths, maxGuests, beds, quantity, ...rest } = input;
	const numericFields = [areaM2, baths, maxGuests, beds, quantity];

	const hasInvalidNumber = numericFields.some(
		(field) => field !== undefined && Number.isNaN(Number(field)),
	);
	if (hasInvalidNumber) {
		throw new ORPCError("INVALID_INPUT", {
			status: 400,
			message: "One or more numeric fields contain invalid numbers.",
		});
	}

	return {
		...rest,
		areaM2: areaM2 !== undefined ? Number(areaM2) : undefined,
		baths: baths !== undefined ? Number(baths) : undefined,
		maxGuests: maxGuests !== undefined ? Number(maxGuests) : undefined,
		beds: beds !== undefined ? Number(beds) : undefined,
		quantity: quantity !== undefined ? Number(quantity) : undefined,
	};
};

// Create: tous les champs requis → retour complet
export async function computeUpsertRoomInput(
	input: UpsertRoomInput,
): Promise<UpsertRoomComputedInput>;

// Update: champs partiels + id → retour partiel
export async function computeUpsertRoomInput(
	input: Partial<UpsertRoomInput> & { id: string },
): Promise<Partial<UpsertRoomComputedInput> & { id: string }>;

export async function computeUpsertRoomInput(
	input: UpsertRoomInput | (Partial<UpsertRoomInput> & { id: string }),
): Promise<
	UpsertRoomComputedInput | (Partial<UpsertRoomComputedInput> & { id: string })
> {
	const { images, ...roomData } = input;

	const result: Record<string, unknown> = {
		...computedStringToNumbers(roomData),
	};

	// Ne compute les images que si elles sont fournies dans l'input
	if (images !== undefined) {
		result.images = await computeRoomImages(images, input);
	}

	return result as UpsertRoomComputedInput;
}
