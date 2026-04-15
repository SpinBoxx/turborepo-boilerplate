import z from "zod";
import {
	BookingNotificationStatus,
	PaymentAttemptStatus,
	PaymentProvider,
} from "../../../../db/prisma/generated/enums";

export const PaymentProviderSchema = z.enum(PaymentProvider);

export const StartPaymentInputSchema = z.object({
	quoteId: z.string().min(1),
	provider: PaymentProviderSchema,
});

export const StripeEmbeddedStartPaymentResultSchema = z.object({
	provider: z.literal(PaymentProvider.STRIPE),
	flow: z.literal("EMBEDDED"),
	paymentAttemptId: z.string().min(1),
	providerSessionId: z.string().min(1),
	clientSecret: z.string().min(1),
});

export const OrangeMoneyRedirectStartPaymentResultSchema = z.object({
	provider: z.literal(PaymentProvider.ORANGE_MONEY),
	flow: z.literal("REDIRECT"),
	paymentAttemptId: z.string().min(1),
	providerSessionId: z.string().min(1),
	redirectUrl: z.string().min(1),
});

export const StartPaymentResultSchema = z.discriminatedUnion("provider", [
	StripeEmbeddedStartPaymentResultSchema,
	OrangeMoneyRedirectStartPaymentResultSchema,
]);

export const PaymentAttemptStatusSchema = z.enum(PaymentAttemptStatus);
export const BookingNotificationStatusSchema = z.enum(BookingNotificationStatus);

export const GetPaymentStatusInputSchema = z.object({
	paymentAttemptId: z.string().min(1),
});

export const GetPaymentStatusResultSchema = z.object({
	paymentAttemptId: z.string().min(1),
	provider: PaymentProviderSchema,
	attemptStatus: PaymentAttemptStatusSchema,
	providerStatus: z.string().nullable(),
	providerSessionStatus: z.string().nullable(),
	providerPaymentStatus: z.string().nullable(),
	hotelBookingRequestNotificationStatus:
		BookingNotificationStatusSchema.nullable(),
});

export type StartPaymentInput = z.infer<typeof StartPaymentInputSchema>;
export type StartPaymentResult = z.infer<typeof StartPaymentResultSchema>;
export type GetPaymentStatusInput = z.infer<typeof GetPaymentStatusInputSchema>;
export type GetPaymentStatusResult = z.infer<typeof GetPaymentStatusResultSchema>;