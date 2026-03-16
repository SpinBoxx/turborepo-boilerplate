export type CloudinaryVariant =
	| "hero"
	| "listing-card"
	| "thumbnail"
	| "gallery";

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

function encodeCloudinaryPathSegment(value: string): string {
	return encodeURIComponent(value);
}

function encodeCloudinaryPublicId(publicId: string): string {
	return publicId
		.split("/")
		.map((segment) => encodeCloudinaryPathSegment(segment))
		.join("/");
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

	const encodedTransformation = encodeCloudinaryPathSegment(transformation);
	const encodedPublicId = encodeCloudinaryPublicId(publicId);

	return `https://res.cloudinary.com/${cloudName}/image/upload/${encodedTransformation}/${encodedPublicId}`;
}

function withWidth(transformation: string, width: number): string {
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

	const baseTransformation = VARIANT_TRANSFORMATIONS[variant];
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
			console.log({ width });

			const transformation = withWidth(baseTransformation, width);
			return `${buildDeliveryUrl(image.publicId as string, transformation)} ${width}w`;
		})
		.join(", ");

	return {
		src,
		srcSet,
	};
}
