import * as z from "zod";
import { RoomType } from "../../../../db/prisma/generated/enums";
import { AmenitySchema } from "../amenity/amenity.schemas";
import {
	CreateRoomImageComputedInputSchema,
	CreateRoomImageInputSchema,
	RoomImageSchema,
} from "../room-image/room-image.schemas";

// Zod schema derived from the Prisma RoomType enum
export const RoomTypeSchema = z.enum(Object.values(RoomType));

export const RoomPriceSchema = z.object({
	id: z.string().min(1),
	roomId: z.string().min(1),
	price: z.number(),
	promoPrice: z.number(),
	startDate: z.date(),
	endDate: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const RoomSchema = z.object({
	id: z.string().min(1),
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	images: z.array(RoomImageSchema),
	amenities: z.array(AmenitySchema),
	prices: z.array(RoomPriceSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const RoomComputedSchema = z.object({
	id: z.string().min(1),
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	images: z.array(RoomImageSchema),
	amenities: z.array(AmenitySchema),
	price: z.number(),
	promoPrice: z.number(),
	prices: z.array(RoomPriceSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateRoomPriceInputSchema = z.object({
	price: z.number(),
	promoPrice: z.number(),
	startDate: z.date(),
	endDate: z.date().nullable(),
});

export const UpsertRoomInputSchema = z.object({
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	prices: z.array(CreateRoomPriceInputSchema),
	amenityIds: z.array(z.string().min(1)),
	images: z.array(CreateRoomImageInputSchema),
});

export const UpsertRoomComputedInputSchema = z.object({
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	prices: z.array(CreateRoomPriceInputSchema),
	amenityIds: z.array(z.string().min(1)),
	images: z.array(CreateRoomImageComputedInputSchema),
});

export const GetRoomInputSchema = z.object({
	id: z.string(),
});

export const DeleteRoomInputSchema = z.object({
	id: z.string(),
});

export const ListRoomsInputSchema = z.object({
	orderBy: z.object({
		price: z.enum(["asc", "desc"]).optional(),
	}),
	where: z.object({
		hotelId: z.string().min(1).optional(),
		hotelName: z.string().optional(),
		type: RoomTypeSchema.optional(),
		startDate: z.date().default(new Date()),
		endDate: z.date().nullable(),
	}),
});

export type ListRoomsInput = z.infer<typeof ListRoomsInputSchema>;
export type RoomPrice = z.infer<typeof RoomPriceSchema>;
export type CreateRoomPriceInput = z.infer<typeof CreateRoomPriceInputSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type RoomComputed = z.infer<typeof RoomComputedSchema>;
export type UpsertRoomInput = z.infer<typeof UpsertRoomInputSchema>;
export type UpsertRoomComputedInput = z.infer<
	typeof UpsertRoomComputedInputSchema
>;
export type GetRoomInput = z.infer<typeof GetRoomInputSchema>;
export type DeleteRoomInput = z.infer<typeof DeleteRoomInputSchema>;
