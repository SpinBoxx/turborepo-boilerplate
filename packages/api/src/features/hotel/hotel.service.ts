import {
	type UploadOptions,
	type UploadResult,
	uploadBase64Image,
} from "../../services/cloudinary.service";
import type { CreateHotelImageInput } from "../hotel-image/hotel-image.schemas";

export const createHotelImages = async (
	images: CreateHotelImageInput[],
	options: UploadOptions,
): Promise<UploadResult[]> => {
	return await Promise.all(
		images.map(async (image, index) => {
			const publicId = options.publicId
				? `${options.publicId}-${index + 1}`
				: undefined;
			return await uploadBase64Image(image.base64, {
				...options,
				publicId,
			});
		}),
	);
};
