import z from "zod";
import { BookingQuoteStatus } from "../../../../db/prisma/generated/enums";

export const BookingQuoteStatusSchema = z.enum(BookingQuoteStatus);

// ─── Output schema ──────────────────────────────────────────────────

export const BookingQuoteComputedSchema = z.object({
	id: z.string().min(1),
	userId: z.string().nullable(),
	hotelId: z.string().min(1),
	roomId: z.string().min(1),
	checkInDate: z.date(),
	checkOutDate: z.date(),
	nights: z.number().int(),
	quantity: z.number().int(),
	guestCount: z.number().int(),
	currency: z.string(),
	subtotalAmount: z.number(),
	discountAmount: z.number(),
	taxAmount: z.number(),
	platformFeePercentageBasisPoints: z.number().int(),
	platformFeeAmount: z.number(),
	hotelPayoutAmount: z.number(),
	totalAmount: z.number(),
	status: BookingQuoteStatusSchema,
	expiresAt: z.date(),
	specialRequests: z.string().nullable(),
	customerFirstName: z.string(),
	customerLastName: z.string(),
	customerEmail: z.string(),
	customerPhoneNumber: z.string(),
	hotelName: z.string(),
	hotelAddress: z.string(),
	roomTitle: z.string(),
	roomType: z.string(),
	roomImage: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// ─── Input schema ───────────────────────────────────────────────────

export const CreateBookingQuoteInputSchema = z.object({
	roomId: z.string().min(1),
	checkInDate: z.string().min(1),
	checkOutDate: z.string().min(1),
	guestCount: z.number().int().min(1),
	quantity: z.number().int().min(1).default(1),
	customerFirstName: z.string().min(1),
	customerLastName: z.string().min(1),
	customerEmail: z.email(),
	customerPhoneNumber: z.string().min(1),
	specialRequests: z.string().optional(),
});

export const GetBookingQuoteInputSchema = z.object({
	id: z.string().min(1),
});

export const CancelBookingQuoteInputSchema = z.object({
	id: z.string().min(1),
});

export type BookingQuoteComputed = z.infer<typeof BookingQuoteComputedSchema>;
export type CreateBookingQuoteInput = z.infer<
	typeof CreateBookingQuoteInputSchema
>;
export type GetBookingQuoteInput = z.infer<typeof GetBookingQuoteInputSchema>;
export type CancelBookingQuoteInput = z.infer<
	typeof CancelBookingQuoteInputSchema
>;
