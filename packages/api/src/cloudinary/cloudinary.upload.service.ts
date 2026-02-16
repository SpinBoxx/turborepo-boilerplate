import type { UploadApiOptions, UploadApiResponse } from "cloudinary";
import { cloudinary } from "./cloudinary";
import { getErrorMessage, toMegabytes } from "./cloudinary.shared";
import {
	getBaseImageTransformations,
	mapUploadTransformations,
} from "./cloudinary.transformations.service";
import type { UploadOptions, UploadResult } from "./cloudinary.types";

const DEFAULT_ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
] as const;

const DEFAULT_MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const DATA_URI_REGEX =
	/^data:(?<mime>[a-zA-Z0-9/+.-]+);base64,(?<payload>[A-Za-z0-9+/=\r\n]+)$/;

type ParsedDataUri = {
	mimeType: string;
	payload: string;
};

function ensureDataUriPrefix(
	base64Image: string,
	format: UploadOptions["format"] = "jpeg",
): string {
	if (base64Image.startsWith("data:")) {
		return base64Image;
	}

	return `data:image/${format};base64,${base64Image}`;
}

function parseDataUri(input: string): ParsedDataUri {
	const matches = DATA_URI_REGEX.exec(input);
	if (!matches?.groups) {
		throw new Error("Invalid image payload. Expected a valid base64 data URI");
	}

	const mimeType = matches.groups.mime;
	const payload = matches.groups.payload;

	if (!mimeType || !payload) {
		throw new Error("Invalid image payload. Missing MIME type or payload");
	}

	return {
		mimeType,
		payload,
	};
}

function estimateBase64SizeInBytes(base64Payload: string): number {
	const payload = base64Payload.replace(/[\r\n\s]/g, "");
	if (!payload.length) {
		return 0;
	}

	if (payload.length % 4 !== 0) {
		throw new Error("Invalid base64 payload length");
	}

	const paddingLength = payload.match(/=+$/)?.[0]?.length ?? 0;
	return Math.floor((payload.length * 3) / 4) - paddingLength;
}

function validateBase64Image(
	formattedBase64: string,
	options: UploadOptions,
): void {
	const { mimeType, payload } = parseDataUri(formattedBase64);

	const allowedMimeTypes =
		options.validation?.allowedMimeTypes ?? DEFAULT_ALLOWED_MIME_TYPES;
	if (!allowedMimeTypes.includes(mimeType)) {
		throw new Error(
			`Unsupported image type "${mimeType}". Allowed types: ${allowedMimeTypes.join(", ")}`,
		);
	}

	const sizeInBytes = estimateBase64SizeInBytes(payload);
	const maxBytes = options.validation?.maxBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
	if (sizeInBytes > maxBytes) {
		throw new Error(
			`Image exceeds maximum upload size (${toMegabytes(maxBytes)}MB)`,
		);
	}
}

function buildUploadOptions(options: UploadOptions): UploadApiOptions {
	const uploadOptions: UploadApiOptions = {
		folder: options.folder ?? "hotels",
		resource_type: "image",
		overwrite: options.overwrite ?? false,
		unique_filename: !options.publicId,
	};

	if (options.publicId) {
		uploadOptions.public_id = options.publicId;
	}

	if (options.tags?.length) {
		uploadOptions.tags = options.tags;
	}

	if (options.transformation?.length) {
		uploadOptions.transformation = options.transformation;
	}

	return uploadOptions;
}

/**
 * Upload a base64 encoded image to Cloudinary.
 * Preserves original asset by default (no forced upload transformations).
 */
export async function uploadBase64Image(
	base64Image: string,
	options: UploadOptions = {},
): Promise<UploadResult> {
	try {
		if (!base64Image || typeof base64Image !== "string") {
			throw new Error("Invalid base64 image string");
		}

		const formattedBase64 = ensureDataUriPrefix(base64Image, options.format);
		validateBase64Image(formattedBase64, options);

		const result: UploadApiResponse = await cloudinary.uploader.upload(
			formattedBase64,
			buildUploadOptions(options),
		);

		return {
			success: true,
			publicId: result.public_id,
			url: result.url,
			secureUrl: result.secure_url,
			width: result.width,
			height: result.height,
			format: result.format,
		};
	} catch (error: unknown) {
		console.error("Error uploading image to Cloudinary:", error);
		return {
			success: false,
			error: getErrorMessage(error, "Unknown error occurred during upload"),
		};
	}
}

/**
 * Upload with normalization chain + auto optimization.
 * Use only when you explicitly want to transform during upload.
 */
export async function uploadBase64ImageOptimized(
	base64Image: string,
	options: UploadOptions = {},
): Promise<UploadResult> {
	return uploadBase64Image(base64Image, {
		...options,
		transformation: options.transformation
			? mapUploadTransformations(options.transformation)
			: getBaseImageTransformations(),
	});
}
