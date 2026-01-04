import * as z from "zod";

export const RoomTypeSchema = z.enum(["STANDARD", "PREMIUM"]);
export type RoomType = z.infer<typeof RoomTypeSchema>;

export const RoomSchema = z.object({
	id: z.string().min(1),
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	price: z.number(),
	promoPrice: z.number(),
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Room = z.infer<typeof RoomSchema>;

export const GetRoomInputSchema = z.object({
	id: z.string(),
});

export const CreateRoomInputSchema = z.object({
	hotelId: z.string().min(1),
	type: RoomTypeSchema,
	price: z.number(),
	promoPrice: z.number(),
	description: z.string().min(1),
	capacity: z.number().int(),
	quantity: z.number().int(),
});

export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;
export type GetRoomInput = z.infer<typeof GetRoomInputSchema>;
