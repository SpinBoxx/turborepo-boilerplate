import {
	type HotelBookingRequestMailInput,
	HotelBookingRequestMailInputSchema,
	type HotelBookingRequestMailLocale,
} from "@zanadeal/mailer/contracts";
import {
	BookingNotificationStatus,
	PaymentProvider,
} from "../../../../db/prisma/generated/enums";
import { fromStoredMoneyAmount } from "../../money";
import { currency as formatCurrency } from "@zanadeal/utils";
import type { BookingQuoteDB } from "../booking-quote/booking-quote.store";
import { getCallbackPayloadRecord } from "./payment-json.service";

const HOTEL_REVIEW_DEADLINE_HOURS = 24;
const DEFAULT_ADMIN_URL = "http://localhost:3000";

interface HotelRecipientSource {
	contacts?: Array<{ email?: string | null }>;
	email?: string | null;
}

interface ActionUrlInput {
	adminUrl: string;
	paymentAttemptId: string;
	quoteId: string;
}

interface ShouldNotifyHotelBookingRequestEmailInput {
	paymentAttempt: Pick<
		{ callbackPayload: unknown; provider: PaymentProvider },
		"callbackPayload" | "provider"
	>;
	providerSessionStatus: string | null;
}

export type HotelBookingRequestEmailStatus =
	| "already_sent"
	| "failed"
	| "missing_hotel_email"
	| "missing_quote"
	| "pending"
	| "processing"
	| "sent";

export type HotelBookingRequestNotificationPayload =
	HotelBookingRequestMailInput["variables"];

export interface HotelBookingRequestNotificationDraft {
	idempotencyKey: string;
	locale: HotelBookingRequestMailLocale;
	payload: HotelBookingRequestNotificationPayload;
	recipient: string;
}

export function getHotelBookingRequestRecipients(
	source: HotelRecipientSource,
): string[] {
	const normalizedEmail = source.email?.trim().toLowerCase();
	if (normalizedEmail) return [normalizedEmail];

	return Array.from(
		new Set(
			source.contacts
				?.map((contact) => contact.email?.trim().toLowerCase())
				.filter((email): email is string => Boolean(email)) ?? [],
		),
	);
}

export function buildHotelBookingRequestActionUrls({
	adminUrl,
	paymentAttemptId,
	quoteId,
}: ActionUrlInput) {
	const acceptUrl = new URL(
		"/hotel-reviewer/bookings/requests/approve",
		adminUrl,
	);
	acceptUrl.searchParams.set("paymentAttemptId", paymentAttemptId);
	acceptUrl.searchParams.set("quoteId", quoteId);

	const rejectUrl = new URL(
		"/hotel-reviewer/bookings/requests/reject",
		adminUrl,
	);
	rejectUrl.searchParams.set("paymentAttemptId", paymentAttemptId);
	rejectUrl.searchParams.set("quoteId", quoteId);

	return {
		acceptUrl: acceptUrl.toString(),
		rejectUrl: rejectUrl.toString(),
	};
}

export function shouldNotifyHotelBookingRequestEmail({
	paymentAttempt,
	providerSessionStatus,
}: ShouldNotifyHotelBookingRequestEmailInput): boolean {
	if (paymentAttempt.provider !== PaymentProvider.STRIPE) {
		return false;
	}

	if (providerSessionStatus !== "complete") {
		return false;
	}

	return !hasHotelBookingRequestLegacySentMarker(
		paymentAttempt.callbackPayload,
	);
}

export function hasHotelBookingRequestLegacySentMarker(
	callbackPayload: unknown,
): boolean {
	return Boolean(
		getCallbackPayloadRecord(callbackPayload).hotelBookingRequestEmailSentAt,
	);
}

export function buildHotelBookingRequestNotificationDraft({
	completedAt,
	paymentAttemptId,
	quote,
}: {
	completedAt: Date;
	paymentAttemptId: string;
	quote: BookingQuoteDB;
}): HotelBookingRequestNotificationDraft | null {
	const recipient = getHotelBookingRequestRecipients(quote.hotel)[0];
	if (!recipient) {
		return null;
	}

	const adminUrl =
		process.env.ADMIN_URL ?? process.env.CLIENT_URL ?? DEFAULT_ADMIN_URL;
	const { acceptUrl, rejectUrl } = buildHotelBookingRequestActionUrls({
		adminUrl,
		paymentAttemptId,
		quoteId: quote.id,
	});
	const reviewDeadline = new Date(completedAt);
	reviewDeadline.setHours(
		reviewDeadline.getHours() + HOTEL_REVIEW_DEADLINE_HOURS,
	);

	return {
		idempotencyKey: `hotel-booking-request:${paymentAttemptId}`,
		locale: "en",
		payload: {
			acceptUrl,
			bookingReference: quote.id,
			checkInDate: quote.checkInDate.toISOString(),
			checkOutDate: quote.checkOutDate.toISOString(),
			currency: quote.currency,
			guestCount: quote.guestCount,
			guestName: `${quote.customerFirstName} ${quote.customerLastName}`.trim(),
			hotelName: quote.hotel.name,
			priceLabel: currencyLabelFromStoredAmount({
				amount: quote.totalAmount,
				currency: quote.currency,
			}),
			rejectUrl,
			reviewDeadline: reviewDeadline.toISOString(),
			roomTitle: quote.room.title,
			specialRequests: quote.specialRequests?.trim() || undefined,
			supportEmail: "contact@zanadeal.com",
			totalAmount: quote.totalAmount,
		},
		recipient,
	};
}

export function parseHotelBookingRequestNotificationPayload(
	payload: unknown,
): HotelBookingRequestNotificationPayload | null {
	const parsed =
		HotelBookingRequestMailInputSchema.shape.variables.safeParse(payload);

	return parsed.success ? parsed.data : null;
}

export function mapNotificationStatusToHotelEmailStatus(
	status: BookingNotificationStatus,
): HotelBookingRequestEmailStatus {
	if (status === BookingNotificationStatus.SENT) {
		return "sent";
	}

	if (status === BookingNotificationStatus.PROCESSING) {
		return "processing";
	}

	if (status === BookingNotificationStatus.FAILED) {
		return "failed";
	}

	return "pending";
}

function currencyLabelFromStoredAmount({
	amount,
	currency,
}: {
	amount: number;
	currency: string;
}): string {
	const normalizedCurrency = currency.toUpperCase();
	const humanAmount = fromStoredMoneyAmount(amount);

	if (normalizedCurrency === "MGA") {
		return formatCurrency(humanAmount);
	}

	const fractionDigits = normalizedCurrency === "MGA" ? 0 : 2;

	return new Intl.NumberFormat("en-US", {
		currency: normalizedCurrency,
		maximumFractionDigits: fractionDigits,
		minimumFractionDigits: fractionDigits,
		style: "currency",
	}).format(humanAmount);
}
