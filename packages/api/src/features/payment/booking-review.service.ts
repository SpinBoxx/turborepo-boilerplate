import { ORPCError } from "@orpc/server";
import { BookingStatus } from "../../../../db/prisma/generated/enums";
import { fromStoredMoneyAmount } from "../../money";
import { currency as formatCurrency } from "@zanadeal/utils";
import {
	getBookingByPaymentAttemptId,
	updateBookingInDb,
} from "./booking.store";
import {
	getPaymentAttemptById,
	updatePaymentAttemptInDb,
} from "./payment.store";
import { getPaymentProviderOrThrow } from "./providers/payment-provider-registry";

export interface ReviewBookingRequestInput {
	actorUserId: string;
	decision: "ACCEPT" | "REJECT";
	paymentAttemptId: string;
	rejectionReason?: string;
	validationNote?: string;
}

export interface ReviewBookingRequestResult {
	bookingId: string;
	decision: "ACCEPT" | "REJECT";
	status: BookingStatus;
}

export async function reviewBookingRequest({
	actorUserId,
	decision,
	paymentAttemptId,
	rejectionReason,
	validationNote,
}: ReviewBookingRequestInput): Promise<ReviewBookingRequestResult> {
	const booking = await getBookingByPaymentAttemptId(paymentAttemptId);

	if (!booking) {
		throw new ORPCError("NOT_FOUND", {
			message: "Booking request could not be found",
		});
	}

	const targetStatus =
		decision === "ACCEPT" ? BookingStatus.CONFIRMED : BookingStatus.REJECTED;

	if (booking.status === targetStatus) {
		return {
			bookingId: booking.id,
			decision,
			status: booking.status,
		};
	}

	if (booking.status !== BookingStatus.PENDING_VALIDATION) {
		throw new ORPCError("CONFLICT", {
			message: "Booking request has already been reviewed",
		});
	}

	const paymentAttempt = await getPaymentAttemptById(paymentAttemptId);

	if (!paymentAttempt) {
		throw new ORPCError("NOT_FOUND", {
			message: "Payment attempt could not be found",
		});
	}

	const paymentProvider = getPaymentProviderOrThrow(paymentAttempt.provider);
	const providerPaymentAttempt = {
		id: paymentAttempt.id,
		providerReference: paymentAttempt.providerReference,
		providerStatus: paymentAttempt.providerStatus,
		transactionId: paymentAttempt.transactionId,
	};

	const providerResult =
		decision === "ACCEPT"
			? await paymentProvider.captureAuthorizedPayment?.({
					paymentAttempt: providerPaymentAttempt,
				})
			: await paymentProvider.cancelAuthorizedPayment?.({
					paymentAttempt: providerPaymentAttempt,
				});

	if (!providerResult) {
		throw new ORPCError("BAD_REQUEST", {
			message:
				decision === "ACCEPT"
					? `Payment provider ${paymentAttempt.provider} does not support payment capture`
					: `Payment provider ${paymentAttempt.provider} does not support payment cancellation`,
		});
	}

	const decisionAt = new Date();

	await updateBookingInDb(booking.id, {
		confirmedAt: decision === "ACCEPT" ? decisionAt : undefined,
		events: {
			create: {
				actorUser: { connect: { id: actorUserId } },
				metadata: {
					decision,
					paymentAttemptId,
					provider: paymentAttempt.provider,
				},
				note:
					decision === "ACCEPT"
						? (validationNote ?? "Booking request accepted by hotel")
						: (rejectionReason ?? "Booking request rejected by hotel"),
				type: decision === "ACCEPT" ? "BOOKING_CONFIRMED" : "BOOKING_REJECTED",
			},
		},
		rejectedAt: decision === "REJECT" ? decisionAt : undefined,
		rejectionReason: decision === "REJECT" ? (rejectionReason ?? null) : null,
		status: targetStatus,
		validatedByUser: { connect: { id: actorUserId } },
		validationNote: decision === "ACCEPT" ? (validationNote ?? null) : null,
	});

	await updatePaymentAttemptInDb(paymentAttempt.id, {
		providerStatus:
			providerResult.providerStatus ?? paymentAttempt.providerStatus,
		transactionId: providerResult.transactionId ?? paymentAttempt.transactionId,
	});

	await sendBookingDecisionEmail({
		booking,
		decision,
		rejectionReason,
	});

	console.log("Booking request reviewed", {
		bookingId: booking.id,
		decision,
		paymentAttemptId,
		providerStatus: providerResult.providerStatus ?? null,
	});

	return {
		bookingId: booking.id,
		decision,
		status: targetStatus,
	};
}

async function sendBookingDecisionEmail({
	booking,
	decision,
	rejectionReason,
}: {
	booking: Awaited<
		ReturnType<typeof getBookingByPaymentAttemptId>
	> extends infer T
		? NonNullable<T>
		: never;
	decision: ReviewBookingRequestInput["decision"];
	rejectionReason?: string;
}) {
	try {
		const mailService = await getMailService();
		const bookingMailVariables = {
			bookingReference: booking.id,
			checkInDate: booking.checkInDate.toISOString(),
			checkOutDate: booking.checkOutDate.toISOString(),
			guestCount: booking.guestCount,
			guestName:
				`${booking.customerFirstName} ${booking.customerLastName}`.trim(),
			hotelName: booking.hotel.name,
			priceLabel: currencyLabelFromStoredAmount({
				amount: booking.totalAmount,
				currency: booking.currency,
			}),
			roomTitle: booking.room.title,
			specialRequests: booking.specialRequests?.trim() || undefined,
			supportEmail: "contact@zanadeal.com",
		};

		if (decision === "ACCEPT") {
			const result = await mailService.sendHotelBookingSuccessMail({
				locale: "en",
				to: booking.customerEmail,
				variables: bookingMailVariables,
			});
			console.log(result);
			return;
		}

		await mailService.sendHotelBookingCancelledMail({
			locale: "en",
			to: booking.customerEmail,
			variables: {
				...bookingMailVariables,
				cancelReason: rejectionReason?.trim() || undefined,
			},
		});
	} catch (error) {
		console.error("Failed to send booking decision email", {
			bookingId: booking.id,
			decision,
			error,
		});
	}
}

async function getMailService() {
	const { mailService } = await import("@zanadeal/mailer");
	return mailService;
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
