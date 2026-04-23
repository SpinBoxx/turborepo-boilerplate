import * as z from "zod";
import { LOCALES } from "../mail-locales";

const MailLocaleSchema = z.enum(LOCALES);

const DateLikeSchema = z.union([z.date(), z.string().min(1)]);

export const HotelBookingCancelledMailInputSchema = z.object({
	locale: MailLocaleSchema,
	variables: z.object({
		bookingReference: z.string().min(1),
		cancelReason: z.string().min(1).optional(),
		checkInDate: DateLikeSchema,
		checkOutDate: DateLikeSchema,
		guestCount: z.number().int().positive(),
		guestName: z.string().min(1),
		hotelName: z.string().min(1),
		priceLabel: z.string().min(1),
		roomTitle: z.string().min(1),
		supportEmail: z.email().optional(),
	}),
});

export const SendHotelBookingCancelledMailInputSchema = z.object({
	to: z.email(),
	locale: MailLocaleSchema.optional().default("en"),
	variables: HotelBookingCancelledMailInputSchema.shape.variables,
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type HotelBookingCancelledMailInput = z.infer<
	typeof HotelBookingCancelledMailInputSchema
>;

export type SendHotelBookingCancelledMailInput = z.infer<
	typeof SendHotelBookingCancelledMailInputSchema
>;

export type HotelBookingCancelledMailLocale = z.infer<typeof MailLocaleSchema>;