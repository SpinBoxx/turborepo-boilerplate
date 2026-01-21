import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../instances/cloudinary";

/**
 * Configuration options for image upload
 */
export interface UploadOptions {
	folder?: string;
	publicId?: string;
	tags?: string[];
	overwrite?: boolean;
	format?: string;
	transformation?: any[];
}

type CloudinaryTransformation = {
	width?: number;
	height?: number;
	crop?: "scale" | "fit" | "fill" | "limit" | "pad" | "thumb";
	quality?: "auto" | number;
	fetch_format?: "jpg" | "png" | "webp" | "avif" | "auto";
	gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
	flags?: string;
	angle?: number;
	effect?: string;
	radius?: string | number;
};

/**
 * Result of image upload operation
 */
export type UploadResult =
	| {
			success: true;
			publicId: string;
			url: string;
			secureUrl: string;
			width: number;
			height: number;
			format: string;
	  }
	| {
			success: false;
			error: string;
	  };

/**
 * Options for retrieving images
 */
interface GetImageOptions {
	width?: number;
	height?: number;
	crop?: "scale" | "fit" | "fill" | "limit" | "pad" | "thumb";
	quality?: "auto" | number;
	format?: "jpg" | "png" | "webp" | "avif" | "auto";
	gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
}

/**
 * Default transformation chain to normalize uploaded images
 * - Resize down to a max width/height (no upscaling)
 * - Auto quality + auto format for best quality/size balance
 */
export function getBaseImageTransformations(
	maxWidth = 2000,
	maxHeight = 2000,
): CloudinaryTransformation[] {
	return [
		{
			width: maxWidth,
			height: maxHeight,
			crop: "fill",
			gravity: "auto",
		},
		{
			quality: "auto",
			fetch_format: "auto",
		},
	];
}

export function mapUploadTransformations(
	transformations?: CloudinaryTransformation[],
): CloudinaryTransformation[] {
	return [...getBaseImageTransformations(), ...(transformations ?? [])];
}

/**
 * Uploads a base64 encoded image to Cloudinary
 * @param base64Image - Base64 encoded image string (with or without data URI prefix)
 * @param options - Upload configuration options
 * @returns Promise with upload result
 */
export async function uploadBase64Image(
	base64Image: string,
	options: UploadOptions = {},
): Promise<UploadResult> {
	try {
		// Validate base64 string
		if (!base64Image || typeof base64Image !== "string") {
			throw new Error("Invalid base64 image string");
		}

		// Ensure data URI prefix exists
		let _formattedBase64 = base64Image;
		if (!base64Image.startsWith("data:")) {
			// Auto-detect format or use default
			const format = options.format || "png";
			_formattedBase64 = `data:image/${format};base64,${base64Image}`;
		}

		// Prepare upload options
		const uploadOptions: any = {
			folder: options.folder || "uploads",
			resource_type: "image",
			overwrite: options.overwrite ?? false,
		};

		if (options.publicId) {
			uploadOptions.public_id = options.publicId;
		}

		if (options.tags && options.tags.length > 0) {
			uploadOptions.tags = options.tags;
		}

		if (options.transformation) {
			uploadOptions.transformation = mapUploadTransformations(
				options.transformation as CloudinaryTransformation[],
			);
		} else {
			uploadOptions.transformation = getBaseImageTransformations();
		}

		// Upload to Cloudinary
		const result: UploadApiResponse = await cloudinary.uploader.upload(
			_formattedBase64,
			// "room_images",
			uploadOptions,
		);

		console.log("Upload result:", result);

		return {
			success: true,
			publicId: result.public_id,
			url: result.url,
			secureUrl: result.secure_url,
			width: result.width,
			height: result.height,
			format: result.format,
		};
	} catch (error: any) {
		console.error("Error uploading image to Cloudinary:", error);
		return {
			success: false,
			error: error.message || "Unknown error occurred during upload",
		};
	}
}

export async function deleteImageByPublicId(publicId: string): Promise<void> {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error: any) {
		console.error("Error deleting image from Cloudinary:", error);
		throw new Error(`Failed to delete image: ${error.message}`);
	}
}

/**
 * Gets an image URL from Cloudinary with optional transformations
 * @param path - Public ID or full path of the image
 * @param options - Image transformation options
 * @returns Transformed image URL
 */
export function getImageUrl(
	path: string,
	options: GetImageOptions = {},
): string {
	try {
		if (!path) {
			throw new Error("Image path is required");
		}

		// Build transformation array
		const transformations: any = {};

		if (options.width) {
			transformations.width = options.width;
		}

		if (options.height) {
			transformations.height = options.height;
		}

		if (options.crop) {
			transformations.crop = options.crop;
		}

		if (options.quality) {
			transformations.quality = options.quality;
		}

		if (options.format) {
			transformations.fetch_format = options.format;
		}

		if (options.gravity) {
			transformations.gravity = options.gravity;
		}
		// Generate URL with transformations
		return cloudinary.url(path, transformations);
	} catch (error: any) {
		console.error("Error generating image URL:", error);
		throw new Error(`Failed to generate image URL: ${error.message}`);
	}
}
