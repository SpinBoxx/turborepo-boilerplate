export type CloudinaryVariant =
	| "hero"
	| "listing-card"
	| "thumbnail"
	| "gallery";

const DEFAULT_CLOUDINARY_VARIANT: CloudinaryVariant = "listing-card";

type CloudinaryImageRef = {
	publicId?: string | null;
};

type BuildImageOptions = {
	variant: CloudinaryVariant;
	responsiveWidths?: ReadonlyArray<number>;
};

const VARIANT_TRANSFORMATIONS: Record<CloudinaryVariant, string> = {
	hero: "c_fill,g_auto:subject,w_1600,h_900,q_auto,f_auto",
	"listing-card": "c_fill,g_auto:subject,w_600,h_450,q_auto:eco,f_auto",
	thumbnail: "c_fill,g_auto:subject,w_400,h_400,q_auto,f_auto",
	gallery: "c_fill,g_auto:subject,w_1200,h_900,q_auto,f_auto",
};

function getVariantTransformation(variant: CloudinaryVariant | undefined): string {
	if (!variant) {
		return VARIANT_TRANSFORMATIONS[DEFAULT_CLOUDINARY_VARIANT];
	}

	return VARIANT_TRANSFORMATIONS[variant] ?? VARIANT_TRANSFORMATIONS[DEFAULT_CLOUDINARY_VARIANT];
}

function getCloudinaryCloudName(): string | undefined {
	return (
		import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.toString().trim() || undefined
	);
}

function buildDeliveryUrl(
	publicId: string,
	transformation: string,
): string | undefined {
	const cloudName = getCloudinaryCloudName();
	if (!cloudName) {
		return undefined;
	}

	return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
}

function withWidth(transformation: string, width: number): string {
	if (!transformation) {
		return "";
	}

	if (!/w_\d+/.test(transformation)) {
		return `w_${width},${transformation}`;
	}

	return transformation.replace(/w_\d+/, `w_${width}`);
}

function normalizeWidths(widths: ReadonlyArray<number> | undefined): number[] {
	if (!widths?.length) {
		return [];
	}

	return [...new Set(widths)]
		.filter((width) => Number.isFinite(width) && width > 0)
		.sort((left, right) => left - right);
}

export type BuiltCloudinaryImage = {
	src?: string;
	srcSet?: string;
};

export function buildCloudinaryImage(
	image: CloudinaryImageRef,
	{ variant, responsiveWidths }: BuildImageOptions,
): BuiltCloudinaryImage {
	if (!image.publicId) {
		return {};
	}

	const baseTransformation = getVariantTransformation(variant);
	const src = buildDeliveryUrl(image.publicId, baseTransformation);
	if (!src) {
		return {};
	}

	const widths = normalizeWidths(responsiveWidths);
	if (!widths.length) {
		return { src };
	}

	const srcSet = widths
		.map((width) => {
			const transformation = withWidth(baseTransformation, width);
			return `${buildDeliveryUrl(image.publicId as string, transformation)} ${width}w`;
		})
		.join(", ");

	return {
		src,
		srcSet,
	};
}
