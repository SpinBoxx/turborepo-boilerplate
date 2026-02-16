import { ORPCError } from "@orpc/client";

import { uploadBase64Image } from "../../../cloudinary/cloudinary.upload.service";
import type { UpsertRoomComputedInput, UpsertRoomInput } from "../room.schemas";

const computeRoomImages = async (
	images: UpsertRoomInput["images"],
	hotelId: string,
): Promise<UpsertRoomComputedInput["images"]> => {
	if (!images?.length) return [];

	return Promise.all(
		images.map(async (image, index) => {
			const result = await uploadBase64Image(image.base64, {
				folder: `hotels/${hotelId}/rooms/${index}`,
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

	const result: Record<string, unknown> = { ...roomData };

	// Ne compute les images que si elles sont fournies dans l'input
	if (images !== undefined) {
		result.images = await computeRoomImages(images, input.hotelId ?? "");
	}

	return result as UpsertRoomComputedInput;
}
