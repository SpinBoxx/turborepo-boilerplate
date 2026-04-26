import z from "zod";
import type { Room } from "../../../../../db/prisma/generated/client";
import { RoomType } from "../../../../../db/prisma/generated/enums";
import { createListSchemaFor } from "../../../utils";
import { AmenityComputedSchema } from "../../amenity";
import {
	CreateRoomImageComputedInputSchema,
	CreateRoomImageInputSchema,
	RoomImageSchema,
} from "../../room-image/room-image.schemas";
import {
	RoomPriceSchema,
	UpsertRoomPriceInputSchema,
} from "./room-price.schema";
import {
	RoomDescriptionTranslationInputListSchema,
	RoomDescriptionTranslationSchema,
} from "./room-description-translation.schemas";

// Zod schema derived from the Prisma RoomType enum
export const RoomTypeSchema = z.enum(RoomType);

// ─── Base computed schema ────────────────────────────────────────────

const RoomComputedSchemaBase = z.object({
	id: z.string().min(1),
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	title: z.string().min(1),
	descriptionTranslations: RoomDescriptionTranslationSchema,
	beds: z.number().int(),
	maxGuests: z.number().int(),
	baths: z.number().int(),
	areaM2: z.number(),
	quantity: z.number().int(),
	availableCapacity: z.number().int(),
	images: z.array(RoomImageSchema),
	amenities: z.array(AmenityComputedSchema),
	price: z.number(),
	promoPrice: z.number(),
	prices: z.array(RoomPriceSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// ─── Per-role schemas ───────────────────────────────────────────────

export const RoomAdminComputedSchema = RoomComputedSchemaBase;

export const RoomUserComputedSchema = RoomComputedSchemaBase;

/** Union schema for output validation (accepts both shapes) */
export const RoomComputedSchema = z.union([
	RoomAdminComputedSchema,
	RoomUserComputedSchema,
]);

export const UpsertRoomInputSchema = z.object({
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	title: z.string().min(1),
	descriptionTranslations: RoomDescriptionTranslationInputListSchema,
	beds: z.string().or(z.number().int()),
	maxGuests: z.string().or(z.number().int()),
	baths: z.string().or(z.number().int()),
	areaM2: z.string().or(z.number()),
	quantity: z.string().or(z.number().int()),
	prices: z.array(UpsertRoomPriceInputSchema),
	amenityIds: z.array(z.string().min(1)),
	images: z.array(CreateRoomImageInputSchema),
});

export const UpsertRoomComputedInputSchema = z.object({
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	title: z.string().min(1),
	descriptionTranslations: RoomDescriptionTranslationSchema,
	beds: z.number().int(),
	maxGuests: z.number().int(),
	baths: z.number().int(),
	areaM2: z.number(),
	quantity: z.number().int(),
	prices: z.array(UpsertRoomPriceInputSchema),
	amenityIds: z.array(z.string().min(1)),
	images: z.array(CreateRoomImageComputedInputSchema),
});

export const GetRoomInputSchema = z.object({
	id: z.string(),
});

export const DeleteRoomInputSchema = z.object({
	id: z.string(),
});

export const ListRoomsInputSchema = createListSchemaFor<Room>()({
	sort: {
		default: {
			direction: "desc",
			field: "createdAt",
		},
		fields: ["createdAt", "maxGuests"],
	},
	filters: {
		type: {
			schema: RoomTypeSchema,
			operators: ["equal"],
		},
	},
});

export type ListRoomsInput = z.infer<typeof ListRoomsInputSchema>;
export type RoomAdminComputed = z.infer<typeof RoomAdminComputedSchema>;
export type RoomUserComputed = z.infer<typeof RoomUserComputedSchema>;
export type RoomComputed = z.infer<typeof RoomComputedSchema>;
export type UpsertRoomInput = z.infer<typeof UpsertRoomInputSchema>;
export type UpsertRoomComputedInput = z.infer<
	typeof UpsertRoomComputedInputSchema
>;
export type GetRoomInput = z.infer<typeof GetRoomInputSchema>;
export type DeleteRoomInput = z.infer<typeof DeleteRoomInputSchema>;
