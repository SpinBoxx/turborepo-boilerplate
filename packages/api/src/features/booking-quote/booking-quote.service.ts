import { getNightlyBreakdown, stringToDate } from "@zanadeal/utils";
import { fromStoredMoneyAmount } from "../../money";
import { getHotel } from "../hotel/hotel.store";
import { getRoomById } from "../room/room.store";
import type {
	BookingQuoteComputed,
	CreateBookingQuoteInput,
} from "./booking-quote.schemas";
import type { BookingQuoteDB } from "./booking-quote.store";
import { createBookingQuoteInDb } from "./booking-quote.store";

const QUOTE_EXPIRATION_HOURS = 24;
const TAX_RATE_BASIS_POINTS = 0; // No tax for now, can be configured later

export async function createBookingQuote(
	input: CreateBookingQuoteInput,
	userId: string | null,
): Promise<BookingQuoteComputed> {
	const room = await getRoomById(input.roomId);
	if (!room) {
		throw new Error("Room not found");
	}

	const hotel = await getHotel(room.hotelId);
	if (!hotel) {
		throw new Error("Hotel not found");
	}

	const checkInDate = stringToDate(input.checkInDate);
	const checkOutDate = stringToDate(input.checkOutDate);

	if (checkOutDate <= checkInDate) {
		throw new Error("Check-out date must be after check-in date");
	}

	if (input.guestCount > room.maxGuests) {
		throw new Error("Guest count exceeds room capacity");
	}

	// Calculate pricing using nightly breakdown
	const breakdown = getNightlyBreakdown(
		room.prices.map((p) => ({
			price: p.price,
			startDate: p.startDate,
			endDate: p.endDate ?? new Date("2099-12-31"),
		})),
		checkInDate,
		checkOutDate,
	);

	const nights = breakdown.length;
	if (nights <= 0) {
		throw new Error("Invalid date range");
	}

	// Subtotal = sum of nightly prices (stored in cents) * quantity
	const subtotalAmount =
		breakdown.reduce((sum, n) => sum + n.price, 0) * input.quantity;

	// Tax calculation
	const taxAmount = Math.round(
		(subtotalAmount * TAX_RATE_BASIS_POINTS) / 10000,
	);

	// Platform fee from hotel config
	const platformFeePercentageBasisPoints =
		hotel.platformFeePercentageBasisPoints;
	const platformFeeAmount = Math.round(
		(subtotalAmount * platformFeePercentageBasisPoints) / 10000,
	);

	// Total = subtotal + tax (platform fee is taken from the subtotal, not added on top)
	const totalAmount = subtotalAmount + taxAmount;

	// Hotel payout = total - platform fee
	const hotelPayoutAmount = totalAmount - platformFeeAmount;

	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + QUOTE_EXPIRATION_HOURS);

	const quote = await createBookingQuoteInDb({
		user: userId ? { connect: { id: userId } } : undefined,
		hotel: { connect: { id: hotel.id } },
		room: { connect: { id: room.id } },
		checkInDate,
		checkOutDate,
		nights,
		quantity: input.quantity,
		guestCount: input.guestCount,
		subtotalAmount,
		discountAmount: 0,
		taxAmount,
		platformFeePercentageBasisPoints,
		platformFeeAmount,
		hotelPayoutAmount,
		totalAmount,
		expiresAt,
		customerFirstName: input.customerFirstName,
		customerLastName: input.customerLastName,
		customerEmail: input.customerEmail,
		customerPhoneNumber: input.customerPhoneNumber,
		specialRequests: input.specialRequests ?? null,
		events: {
			create: {
				type: "QUOTE_CREATED",
				actorUser: userId ? { connect: { id: userId } } : undefined,
			},
		},
	});

	return computeBookingQuote(quote);
}

export function computeBookingQuote(
	quote: BookingQuoteDB,
): BookingQuoteComputed {
	return {
		id: quote.id,
		userId: quote.userId,
		hotelId: quote.hotelId,
		roomId: quote.roomId,
		checkInDate: quote.checkInDate,
		checkOutDate: quote.checkOutDate,
		nights: quote.nights,
		quantity: quote.quantity,
		guestCount: quote.guestCount,
		currency: quote.currency,
		subtotalAmount: fromStoredMoneyAmount(quote.subtotalAmount),
		discountAmount: fromStoredMoneyAmount(quote.discountAmount),
		taxAmount: fromStoredMoneyAmount(quote.taxAmount),
		platformFeePercentageBasisPoints: quote.platformFeePercentageBasisPoints,
		platformFeeAmount: fromStoredMoneyAmount(quote.platformFeeAmount),
		hotelPayoutAmount: fromStoredMoneyAmount(quote.hotelPayoutAmount),
		totalAmount: fromStoredMoneyAmount(quote.totalAmount),
		status: quote.status,
		expiresAt: quote.expiresAt,
		specialRequests: quote.specialRequests,
		customerFirstName: quote.customerFirstName,
		customerLastName: quote.customerLastName,
		customerEmail: quote.customerEmail,
		customerPhoneNumber: quote.customerPhoneNumber,
		hotelName: quote.hotel.name,
		hotelAddress: quote.hotel.address,
		roomTitle: quote.room.title,
		roomType: quote.room.type,
		roomImage: quote.room.images[0]?.publicId ?? null,
		createdAt: quote.createdAt,
		updatedAt: quote.updatedAt,
	};
}
