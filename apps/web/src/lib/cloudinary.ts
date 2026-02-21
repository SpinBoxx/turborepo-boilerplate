type CloudinaryVariant = "hero" | "listing-card" | "room-thumbnail" | "room-gallery";

type CloudinaryImageRef = {
	url?: string | null;
	publicId?: string | null;
};

type BuildImageOptions = {
	variant: CloudinaryVariant;
	responsiveWidths?: ReadonlyArray<number>;
};

const VARIANT_TRANSFORMATIONS: Record<CloudinaryVariant, string> = {
	hero: "c_fill,g_auto:subject,w_1600,h_900,q_auto,f_auto",
	"listing-card": "c_fill,g_auto:subject,w_600,h_450,q_auto:eco,f_auto",
	"room-thumbnail": "c_fill,g_auto:subject,w_400,h_400,q_auto,f_auto",
	"room-gallery": "c_fill,g_auto:subject,w_1200,h_900,q_auto,f_auto",
};

function isCloudinaryDeliveryUrl(url: string): boolean {
	return url.includes("res.cloudinary.com") && url.includes("/image/upload/");
}

function injectTransformation(url: string, transformation: string): string {
	if (!isCloudinaryDeliveryUrl(url)) {
		return url;
	}

	return url.replace("/image/upload/", `/image/upload/${transformation}/`);
}

function withWidth(transformation: string, width: number): string {
	return transformation.replace(/w_\d+/, `w_${width}`);
}

function normalizeWidths(
	widths: ReadonlyArray<number> | undefined,
): number[] {
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
	if (!image.url) {
		return {};
	}

	const baseTransformation = VARIANT_TRANSFORMATIONS[variant];
	const src = injectTransformation(image.url, baseTransformation);

	const widths = normalizeWidths(responsiveWidths);
	if (!widths.length) {
		return { src };
	}

	const srcSet = widths
		.map((width) => {
			const transformation = withWidth(baseTransformation, width);
			return `${injectTransformation(image.url as string, transformation)} ${width}w`;
		})
		.join(", ");

	return {
		src,
		srcSet,
	};
}
