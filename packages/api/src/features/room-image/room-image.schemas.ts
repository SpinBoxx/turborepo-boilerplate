import * as z from "zod";

export const RoomImageSchema = z.object({
	id: z.string().min(1),
	publicId: z.string().min(1),
	roomId: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type RoomImage = z.infer<typeof RoomImageSchema>;

export const GetRoomImageInputSchema = z.object({
	id: z.string(),
});

export const CreateRoomImageInputSchema = z.object({
	base64: z.string().min(1),
});

export const CreateRoomImageComputedInputSchema = z.object({
	publicId: z.string(),
});

export type CreateRoomImageInput = z.infer<typeof CreateRoomImageInputSchema>;
export type GetRoomImageInput = z.infer<typeof GetRoomImageInputSchema>;
