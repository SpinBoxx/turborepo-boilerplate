import z from "zod";
import {
	BookingNotificationStatus,
	BookingQuoteStatus,
	BookingStatus,
	PaymentAttemptStatus,
	PaymentProvider,
} from "../../../../db/prisma/generated/enums";

export const BookingStatsGranularitySchema = z.enum([
	"day",
	"month",
	"year",
]);

export const BookingStatsFiltersInputSchema = z
	.object({
		endDate: z.coerce.date().optional(),
		granularity: BookingStatsGranularitySchema.default("day"),
		hotelId: z.string().min(1).optional(),
		paymentProvider: z.enum(PaymentProvider).optional(),
		roomId: z.string().min(1).optional(),
		startDate: z.coerce.date().optional(),
		statuses: z.array(z.enum(BookingStatus)).optional(),
	})
	.superRefine((input, context) => {
		if (input.startDate && input.endDate && input.startDate > input.endDate) {
			context.addIssue({
				code: "custom",
				message: "startDate must be before endDate",
				path: ["startDate"],
			});
		}

		if (input.startDate && input.endDate) {
			const windowMs = input.endDate.getTime() - input.startDate.getTime();
			const maxWindowMs = 370 * 24 * 60 * 60 * 1000;
			if (windowMs > maxWindowMs) {
				context.addIssue({
					code: "custom",
					message: "Date range cannot exceed 370 days",
					path: ["endDate"],
				});
			}
		}
	});

const MoneyMetricSchema = z.object({
	amount: z.number().int(),
	currency: z.string().min(1),
});

export const BookingStatsSummarySchema = z.object({
	activeQuotesCount: z.number().int(),
	cancelledCount: z.number().int(),
	checkedInCount: z.number().int(),
	checkedOutCount: z.number().int(),
	confirmedCount: z.number().int(),
	failedNotificationCount: z.number().int(),
	grossPaid: MoneyMetricSchema,
	guestCount: z.number().int(),
	hotelPayout: MoneyMetricSchema,
	noShowCount: z.number().int(),
	nightsCount: z.number().int(),
	pendingPaymentCount: z.number().int(),
	pendingValidationCount: z.number().int(),
	platformFee: MoneyMetricSchema,
	quantityCount: z.number().int(),
	refunded: MoneyMetricSchema,
	rejectedCount: z.number().int(),
	totalBookings: z.number().int(),
});

export const BookingStatsChartRecordSchema = z.object({
	cancelledCount: z.number(),
	checkedInCount: z.number(),
	checkedOutCount: z.number(),
	confirmedAmount: z.number(),
	confirmedCount: z.number(),
	date: z.string().datetime(),
	grossPaidAmount: z.number(),
	guestCount: z.number(),
	hotelPayoutAmount: z.number(),
	noShowCount: z.number(),
	nightsCount: z.number(),
	pendingValidationCount: z.number(),
	platformFeeAmount: z.number(),
	quantityCount: z.number(),
	refundedAmount: z.number(),
	rejectedCount: z.number(),
	totalBookings: z.number(),
});

export const BookingStatsStatusBreakdownSchema = z.object({
	count: z.number().int(),
	status: z.enum(BookingStatus),
});

export const BookingStatsQuoteBreakdownSchema = z.object({
	count: z.number().int(),
	status: z.enum(BookingQuoteStatus),
});

export const BookingStatsPaymentBreakdownSchema = z.object({
	count: z.number().int(),
	provider: z.enum(PaymentProvider),
	status: z.enum(PaymentAttemptStatus),
});

export const BookingStatsNotificationBreakdownSchema = z.object({
	count: z.number().int(),
	status: z.enum(BookingNotificationStatus),
});

export const BookingStatsRecentBookingSchema = z.object({
	checkInDate: z.string().datetime(),
	checkOutDate: z.string().datetime(),
	createdAt: z.string().datetime(),
	currency: z.string().min(1),
	guestCount: z.number().int(),
	hotelName: z.string().min(1),
	id: z.string().min(1),
	roomTitle: z.string().min(1),
	status: z.enum(BookingStatus),
	totalAmount: z.number().int(),
});

export const BookingStatsRecentEventSchema = z.object({
	bookingId: z.string().min(1).nullable(),
	id: z.string().min(1),
	note: z.string().nullable(),
	occurredAt: z.string().datetime(),
	type: z.string().min(1),
});

export const BookingStatsSnapshotSchema = z.object({
	chartRecords: z.array(BookingStatsChartRecordSchema),
	filters: BookingStatsFiltersInputSchema,
	generatedAt: z.string().datetime(),
	notificationBreakdown: z.array(BookingStatsNotificationBreakdownSchema),
	paymentBreakdown: z.array(BookingStatsPaymentBreakdownSchema),
	quoteBreakdown: z.array(BookingStatsQuoteBreakdownSchema),
	recentBookings: z.array(BookingStatsRecentBookingSchema),
	recentEvents: z.array(BookingStatsRecentEventSchema),
	statusBreakdown: z.array(BookingStatsStatusBreakdownSchema),
	summary: BookingStatsSummarySchema,
});

export type BookingStatsFiltersInput = z.infer<
	typeof BookingStatsFiltersInputSchema
>;
export type BookingStatsSnapshot = z.infer<typeof BookingStatsSnapshotSchema>;
export type BookingStatsChartRecord = z.infer<
	typeof BookingStatsChartRecordSchema
>;
