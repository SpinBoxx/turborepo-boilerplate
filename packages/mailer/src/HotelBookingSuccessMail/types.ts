import * as z from "zod";
import { LOCALES } from "../mail-locales";

const MailLocaleSchema = z.enum(LOCALES);

const DateLikeSchema = z.union([z.date(), z.string().min(1)]);

export const HotelBookingSuccessMailInputSchema = z.object({
	locale: MailLocaleSchema,
	variables: z.object({
		bookingReference: z.string().min(1),
		checkInDate: DateLikeSchema,
		checkOutDate: DateLikeSchema,
		guestCount: z.number().int().positive(),
		guestName: z.string().min(1),
		hotelName: z.string().min(1),
		priceLabel: z.string().min(1),
		roomTitle: z.string().min(1),
		specialRequests: z.string().optional(),
		supportEmail: z.email().optional(),
	}),
});

export const SendHotelBookingSuccessMailInputSchema = z.object({
	to: z.email(),
	locale: MailLocaleSchema.optional().default("en"),
	variables: HotelBookingSuccessMailInputSchema.shape.variables,
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type HotelBookingSuccessMailInput = z.infer<
	typeof HotelBookingSuccessMailInputSchema
>;

export type SendHotelBookingSuccessMailInput = z.infer<
	typeof SendHotelBookingSuccessMailInputSchema
>;

export type HotelBookingSuccessMailLocale = z.infer<typeof MailLocaleSchema>;