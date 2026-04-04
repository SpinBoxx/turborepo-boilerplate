import z from "zod";
import { createHybridListSchemaFor } from "../../../listing/hybrid-list";
import { AmenityComputedSchema } from "../../amenity";
import { RoomComputedSchema } from "../../room";
import {
	BankAccountSchema,
	UpsertBankAccountInputSchema,
} from "./hotel-bank-account";
import {
	CreateHotelImageComputedInputSchema,
	CreateHotelImageInputSchema,
	HotelImageSchema,
} from "./hotel-images.schemas";
import { ReviewSchema } from "./hotel-reviews.schemas";

// ─── Base computed schema (all fields) ──────────────────────────────

const HotelComputedSchemaBase = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	bankAccount: BankAccountSchema.optional().nullable(),
	amenities: z.array(AmenityComputedSchema),
	images: z.array(HotelImageSchema),
	reviews: z.array(ReviewSchema),
	rating: z.number(),
	startingPrice: z.number(),
	rooms: z.array(RoomComputedSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// ─── Per-role schemas ───────────────────────────────────────────────

export const HotelAdminComputedSchema = HotelComputedSchemaBase;

export const HotelUserComputedSchema = HotelComputedSchemaBase.omit({
	isArchived: true,
	bankAccount: true,
	reviews: true,
});

/** Union schema for output validation (accepts both shapes) */
export const HotelComputedSchema = z.union([
	HotelAdminComputedSchema,
	HotelUserComputedSchema,
]);

export const UpsertHotelInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean().default(false),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional(),
	phoneNumber: z.string().optional(),
	amenityIds: z.array(z.string().min(1)),
	bankAccount: UpsertBankAccountInputSchema.optional(),
	images: z.array(CreateHotelImageInputSchema),
});

export const UpsertHotelComputedInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	address: z.string().min(1),
	mapLink: z.string().min(1),
	isArchived: z.boolean().optional(),
	latitude: z.string().min(1),
	longitude: z.string().min(1),
	email: z.email().optional(),
	phoneNumber: z.string().optional(),
	amenityIds: z.array(z.string().min(1)).optional(),
	bankAccount: UpsertBankAccountInputSchema.optional(),
	images: z.array(CreateHotelImageComputedInputSchema).optional(),
});

export const GetHotelInputSchema = z.object({
	id: z.string(),
	checkInDate: z.string().optional(),
	checkOutDate: z.string().optional(),
});

export const hotelListConfig = {
	sort: {
		default: {
			direction: "desc",
			field: "updatedAt",
		},
		fields: {
			name: { stage: "db" },
			updatedAt: { stage: "db" },
			startingPrice: { stage: "computed" },
			rating: { stage: "computed" },
		},
	},
	filters: {
		name: {
			stage: "db",
			schema: z.string(),
			operators: ["contains", "equal"],
		},
		updatedAt: {
			stage: "db",
			schema: z.coerce.date(),
			operators: ["gte", "lte"],
		},
		startingPrice: {
			stage: "computed",
			schema: z.number(),
			operators: ["gte", "lte", "equal"],
		},
		rating: {
			stage: "computed",
			schema: z.number(),
			operators: ["gte", "lte", "equal"],
		},
	},
} as const;

export const ListHotelsInputSchema = createHybridListSchemaFor()(
	hotelListConfig,
).and(
	z.object({
		checkInDate: z.string().optional(),
		checkOutDate: z.string().optional(),
	}),
);

export const DeleteHotelInputSchema = z.object({
	id: z.string().min(1),
});

export const ToggleIsArchivedHotelInputSchema = z.object({
	id: z.string().min(1),
});

export type HotelAdminComputed = z.infer<typeof HotelAdminComputedSchema>;
export type HotelUserComputed = z.infer<typeof HotelUserComputedSchema>;
export type HotelComputed = z.infer<typeof HotelComputedSchema>;
/** @deprecated Use HotelComputed instead */
export type Hotel = HotelComputed;
export type UpsertHotelInput = z.infer<typeof UpsertHotelInputSchema>;
export type UpsertHotelComputedInput = z.infer<
	typeof UpsertHotelComputedInputSchema
>;
export type GetHotelInput = z.infer<typeof GetHotelInputSchema>;
export type ListHotelsInput = z.infer<typeof ListHotelsInputSchema>;
export type DeleteHotelInput = z.infer<typeof DeleteHotelInputSchema>;
export type ToggleIsArchivedHotelInput = z.infer<
	typeof ToggleIsArchivedHotelInputSchema
>;
