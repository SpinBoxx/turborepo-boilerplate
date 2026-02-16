import { cloudinary } from "./cloudinary";
import { assertNonEmptyString, getErrorMessage } from "./cloudinary.shared";
import { getHotelVariantTransformation } from "./cloudinary.transformations.service";
import type {
	CloudinaryTransformation,
	GetImageOptions,
	HotelImageVariant,
} from "./cloudinary.types";

type CloudinaryUrlOptions = Parameters<typeof cloudinary.url>[1];

function toUrlOptions(options: GetImageOptions): CloudinaryUrlOptions {
	const mapped: CloudinaryUrlOptions = {
		width: options.width,
		height: options.height,
		crop: options.crop,
		quality: options.quality,
		fetch_format: options.format,
		gravity: options.gravity,
		dpr: options.dpr,
		background: options.background,
		flags: options.flags,
		effect: options.effect,
	};

	return mapped;
}

function toGetImageOptions(
	transformation: CloudinaryTransformation,
): GetImageOptions {
	return {
		width: transformation.width,
		height: transformation.height,
		crop: transformation.crop,
		quality: transformation.quality,
		format: transformation.fetch_format,
		gravity: transformation.gravity,
		dpr: transformation.dpr,
		background: transformation.background,
		flags: transformation.flags,
		effect: transformation.effect,
	};
}

export function getImageUrl(path: string, options: GetImageOptions = {}): string {
	try {
		assertNonEmptyString(path, "Image path");
		return cloudinary.url(path, toUrlOptions(options));
	} catch (error: unknown) {
		console.error("Error generating image URL:", error);
		throw new Error(
			`Failed to generate image URL: ${getErrorMessage(error, "Unknown URL generation error")}`,
		);
	}
}

export function getHotelImageUrl(
	publicId: string,
	variant: HotelImageVariant,
	overrides: Partial<GetImageOptions> = {},
): string {
	const preset = toGetImageOptions(getHotelVariantTransformation(variant));
	return getImageUrl(publicId, {
		...preset,
		...overrides,
	});
}

export function getImageSrcSet(
	publicId: string,
	widths: ReadonlyArray<number>,
	baseOptions: Omit<GetImageOptions, "width"> = {},
): string {
	assertNonEmptyString(publicId, "publicId");

	const uniqueSortedWidths = [...new Set(widths)]
		.filter((width) => Number.isFinite(width) && width > 0)
		.sort((left, right) => left - right);

	if (!uniqueSortedWidths.length) {
		throw new Error("At least one positive width is required to build srcSet");
	}

	return uniqueSortedWidths
		.map((width) => `${getImageUrl(publicId, { ...baseOptions, width })} ${width}w`)
		.join(", ");
}
