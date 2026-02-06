import { ORPCError } from "@orpc/client";
import { uploadBase64Image } from "../../../cloudinary/cloudinary.service";
import type {
	UpsertHotelComputedInput,
	UpsertHotelInput,
} from "../schemas/hotel.schema";

const computeHotelImages = async (
	images: UpsertHotelInput["images"],
	folderName: string,
): Promise<UpsertHotelComputedInput["images"]> => {
	if (!images?.length) return [];

	return Promise.all(
		images.map(async (image, index) => {
			const result = await uploadBase64Image(image.base64, {
				folder: `hotels/${folderName.replace(" ", "")}`,
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
export async function computeUpsertHotelInput(
	input: UpsertHotelInput,
): Promise<UpsertHotelComputedInput>;

// Update: champs partiels + id → retour partiel
export async function computeUpsertHotelInput(
	input: Partial<UpsertHotelInput> & { id: string },
): Promise<Partial<UpsertHotelComputedInput> & { id: string }>;

export async function computeUpsertHotelInput(
	input: UpsertHotelInput | (Partial<UpsertHotelInput> & { id: string }),
): Promise<
	| UpsertHotelComputedInput
	| (Partial<UpsertHotelComputedInput> & { id: string })
> {
	const { amenityIds, images, bankAccount, ...hotelData } = input;

	const result: Record<string, unknown> = { ...hotelData };

	// Ne compute les images que si elles sont fournies dans l'input
	if (images !== undefined) {
		result.images = await computeHotelImages(images, input.name ?? "hotel");
	}

	return result as UpsertHotelComputedInput;
}
