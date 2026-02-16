import type {
	CloudinaryTransformation,
	HotelImageVariant,
} from "./cloudinary.types";

const HOTEL_VARIANT_TRANSFORMATIONS: Record<
	HotelImageVariant,
	CloudinaryTransformation
> = {
	hero: {
		width: 1600,
		height: 900,
		crop: "fill",
		gravity: "auto:subject",
		quality: "auto",
		fetch_format: "auto",
	},
	"listing-card": {
		width: 600,
		height: 450,
		crop: "fill",
		gravity: "auto:subject",
		quality: "auto:eco",
		fetch_format: "auto",
	},
	"room-thumbnail": {
		width: 400,
		height: 400,
		crop: "fill",
		gravity: "auto:subject",
		quality: "auto",
		fetch_format: "auto",
	},
	"room-gallery": {
		width: 1200,
		height: 900,
		crop: "fill",
		gravity: "auto:subject",
		quality: "auto",
		fetch_format: "auto",
	},
};

export function getBaseImageTransformations(
	maxWidth = 3840,
	maxHeight = 3840,
): CloudinaryTransformation[] {
	return [
		{
			width: maxWidth,
			height: maxHeight,
			crop: "limit",
		},
		{
			quality: "auto",
			fetch_format: "auto",
		},
	];
}

export function mapUploadTransformations(
	transformations: CloudinaryTransformation[] = [],
): CloudinaryTransformation[] {
	return [...getBaseImageTransformations(), ...transformations];
}

export function getHotelVariantTransformation(
	variant: HotelImageVariant,
): CloudinaryTransformation {
	return HOTEL_VARIANT_TRANSFORMATIONS[variant];
}

export function getResponsiveFillTransformation(
	base?: Partial<CloudinaryTransformation>,
): CloudinaryTransformation {
	return {
		width: "auto",
		dpr: "auto",
		crop: "fill",
		gravity: "auto:subject",
		quality: "auto",
		fetch_format: "auto",
		...base,
	};
}
