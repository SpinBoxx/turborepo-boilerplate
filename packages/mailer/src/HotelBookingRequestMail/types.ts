import * as z from "zod";
import { LOCALES } from "../mail-locales";

const MailLocaleSchema = z.enum(LOCALES);

const DateLikeSchema = z.union([z.date(), z.string().min(1)]);

export const HotelBookingRequestMailInputSchema = z.object({
	locale: MailLocaleSchema,
	variables: z.object({
		acceptUrl: z.url(),
		bookingReference: z.string().min(1),
		checkInDate: DateLikeSchema,
		checkOutDate: DateLikeSchema,
		currency: z.string().min(1),
		guestCount: z.number().int().positive(),
		guestName: z.string().min(1),
		hotelName: z.string().min(1),
		priceLabel: z.string().min(1).optional(),
		rejectUrl: z.url(),
		reviewDeadline: DateLikeSchema.optional(),
		roomTitle: z.string().min(1),
		specialRequests: z.string().optional().nullable(),
		supportEmail: z.email().optional(),
		totalAmount: z.number().int().nonnegative().optional(),
	}),
});

export const SendHotelBookingRequestMailInputSchema = z.object({
	to: z.email(),
	locale: MailLocaleSchema.optional().default("en"),
	variables: HotelBookingRequestMailInputSchema.shape.variables,
	subject: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
});

export type HotelBookingRequestMailInput = z.infer<
	typeof HotelBookingRequestMailInputSchema
>;

export type SendHotelBookingRequestMailInput = z.infer<
	typeof SendHotelBookingRequestMailInputSchema
>;

export type HotelBookingRequestMailLocale = z.infer<typeof MailLocaleSchema>;
