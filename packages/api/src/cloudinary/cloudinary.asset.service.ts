import { cloudinary } from "./cloudinary";
import { assertNonEmptyString, getErrorMessage } from "./cloudinary.shared";

export async function deleteImageByPublicId(publicId: string): Promise<void> {
	assertNonEmptyString(publicId, "publicId");

	try {
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: "image",
			invalidate: true,
		});

		if (result.result !== "ok" && result.result !== "not found") {
			throw new Error(`Unexpected Cloudinary delete result: ${result.result}`);
		}
	} catch (error: unknown) {
		console.error("Error deleting image from Cloudinary:", error);
		throw new Error(
			`Failed to delete image: ${getErrorMessage(error, "Unknown delete error")}`,
		);
	}
}
