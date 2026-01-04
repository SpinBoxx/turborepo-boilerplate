import * as z from "zod";

export const BookingSchema = z.object({
	id: z.string().min(1),
	userId: z.string().min(1).nullable(),
	roomId: z.string().min(1),
	startDate: z.date(),
	endDate: z.date(),
	quantity: z.number().int(),
	metadata: z.unknown(),
	isCancelled: z.boolean(),
	specialRequests: z.string().nullable(),
	paymentId: z.string().nullable(),
	guestId: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Booking = z.infer<typeof BookingSchema>;

export const GetBookingInputSchema = z.object({
	id: z.string(),
});

export const CreateBookingInputSchema = z.object({
	userId: z.string().min(1).nullable().optional(),
	roomId: z.string().min(1),
	startDate: z.date(),
	endDate: z.date(),
	quantity: z.number().int(),
	metadata: z.unknown(),
	isCancelled: z.boolean().optional(),
	specialRequests: z.string().nullable().optional(),
	paymentId: z.string().nullable().optional(),
	guestId: z.string().min(1),
});

export type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;
export type GetBookingInput = z.infer<typeof GetBookingInputSchema>;
