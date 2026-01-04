import * as z from "zod";

export const FavoriteSchema = z.object({
	id: z.string().min(1),
	userId: z.string().min(1),
	hotelId: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Favorite = z.infer<typeof FavoriteSchema>;

export const GetFavoriteInputSchema = z.object({
	id: z.string(),
});

export const CreateFavoriteInputSchema = z.object({
	userId: z.string().min(1),
	hotelId: z.string().min(1),
});

export type CreateFavoriteInput = z.infer<typeof CreateFavoriteInputSchema>;
export type GetFavoriteInput = z.infer<typeof GetFavoriteInputSchema>;
