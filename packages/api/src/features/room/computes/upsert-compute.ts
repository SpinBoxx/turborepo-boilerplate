import { ORPCError } from "@orpc/client";

import { uploadBase64Image } from "../../../cloudinary/cloudinary.service";
import type { UpsertRoomComputedInput, UpsertRoomInput } from "../room.schemas";

export const computeUpsertRoomInput = async (
	input: UpsertRoomInput,
): Promise<UpsertRoomComputedInput> => {
	const computedImages = await computeRoomImages(input);

	return {
		...input,
		images: computedImages,
	};
};

const computeRoomImages = async (
	input: UpsertRoomInput,
): Promise<UpsertRoomComputedInput["images"]> => {
	let images: UpsertRoomComputedInput["images"] = [];

	if (input.images.length) {
		images = await Promise.all(
			input.images.map(async (image, index) => {
				const result = await uploadBase64Image(image.base64, {
					folder: `hotels/${input.hotelId}/rooms/${index}`,
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
	}
	return images;
};
