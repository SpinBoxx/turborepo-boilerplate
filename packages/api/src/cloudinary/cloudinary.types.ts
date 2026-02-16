export type CloudinaryCropMode =
	| "scale"
	| "fit"
	| "fill"
	| "limit"
	| "pad"
	| "thumb"
	| "crop";

export type CloudinaryImageFormat =
	| "jpg"
	| "jpeg"
	| "png"
	| "webp"
	| "avif"
	| "auto";

export type CloudinaryGravity =
	| "auto"
	| "auto:subject"
	| "face"
	| "center"
	| "north"
	| "south"
	| "east"
	| "west";

export type CloudinaryDpr = "auto" | number;

export interface CloudinaryTransformation {
	width?: number | "auto";
	height?: number;
	crop?: CloudinaryCropMode;
	quality?: "auto" | "auto:eco" | number;
	fetch_format?: CloudinaryImageFormat;
	gravity?: CloudinaryGravity;
	flags?: string;
	angle?: number;
	effect?: string;
	radius?: string | number;
	dpr?: CloudinaryDpr;
	background?: "auto" | string;
}

export interface UploadValidationOptions {
	maxBytes?: number;
	allowedMimeTypes?: ReadonlyArray<string>;
}

export interface UploadOptions {
	folder?: string;
	publicId?: string;
	tags?: string[];
	overwrite?: boolean;
	format?: Exclude<CloudinaryImageFormat, "auto">;
	transformation?: CloudinaryTransformation[];
	validation?: UploadValidationOptions;
}

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

export interface GetImageOptions {
	width?: number | "auto";
	height?: number;
	crop?: CloudinaryCropMode;
	quality?: "auto" | "auto:eco" | number;
	format?: CloudinaryImageFormat;
	gravity?: CloudinaryGravity;
	dpr?: CloudinaryDpr;
	background?: "auto" | string;
	flags?: string;
	effect?: string;
}

export type HotelImageVariant =
	| "hero"
	| "listing-card"
	| "room-thumbnail"
	| "room-gallery";
