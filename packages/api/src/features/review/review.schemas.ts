import * as z from "zod";

export const ReviewSchema = z.object({
	id: z.string().min(1),
	userId: z.string().min(1),
	hotelId: z.string().min(1),
	rating: z.number().int(),
	comment: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;

export const GetReviewInputSchema = z.object({
	id: z.string(),
});

export const CreateReviewInputSchema = z.object({
	userId: z.string().min(1),
	hotelId: z.string().min(1),
	rating: z.number().int(),
	comment: z.string().nullable().optional(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewInputSchema>;
export type GetReviewInput = z.infer<typeof GetReviewInputSchema>;
