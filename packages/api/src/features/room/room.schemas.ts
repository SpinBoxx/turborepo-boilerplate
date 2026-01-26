import * as z from "zod";
import { AmenitySchema } from "../amenity/amenity.schemas";
import { RoomImageSchema } from "../room-image/room-image.schemas";

export const RoomTypeSchema = z.enum(["STANDARD", "PREMIUM"]);

export const RoomPriceSchema = z.object({
	id: z.string().min(1),
	roomId: z.string().min(1),
	price: z.number(),
	startDate: z.date(),
	endDate: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const RoomSchema = z.object({
	id: z.string().min(1),
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	promoPrice: z.number(),
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	images: z.array(RoomImageSchema),
	amenities: z.array(AmenitySchema),
	prices: z.array(RoomPriceSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateRoomPrice = z.object({
	roomId: z.string().min(1),
	price: z.number(),
	startDate: z.date(),
	endDate: z.date().optional(),
});

export const CreateRoomInputSchema = z.object({
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	promoPrice: z.number(),
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	prices: z.array(CreateRoomPrice),
});

export const GetRoomInputSchema = z.object({
	id: z.string(),
});

export const ListRoomsInputSchema = z.object({
	orderBy: z.object({
		price: z.enum(["asc", "desc"]).optional(),
	}),
	where: z.object({
		hotelId: z.string().min(1).optional(),
		type: RoomTypeSchema.optional(),
		startDate: z.date().default(new Date()),
		endDate: z.date().optional(),
	}),
});

export type ListRoomsInput = z.infer<typeof ListRoomsInputSchema>;
export type RoomType = z.infer<typeof RoomTypeSchema>;
export type RoomPrice = z.infer<typeof RoomPriceSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;
export type GetRoomInput = z.infer<typeof GetRoomInputSchema>;
