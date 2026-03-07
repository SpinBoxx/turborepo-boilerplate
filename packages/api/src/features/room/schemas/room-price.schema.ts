import z from "zod";

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

export const UpsertRoomPriceInputSchema = z.object({
	price: z.number(),
	promoPrice: z.number(),
	startDate: z.date(),
	endDate: z.date().nullable(),
});

export type RoomPrice = z.infer<typeof RoomPriceSchema>;
export type UpsertRoomPriceInput = z.infer<typeof UpsertRoomPriceInputSchema>;
