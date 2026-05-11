import type {
	CancelBookingQuoteInput,
	CreateBookingQuoteInput,
	GetBookingQuoteInput,
} from "@zanadeal/api/features/booking-quote";
import { orpc } from "@/lib/orpc";

export async function createBookingQuote(input: CreateBookingQuoteInput) {
	return orpc.bookingQuote.create(input);
}

export async function getBookingQuoteById(input: GetBookingQuoteInput) {
	return orpc.bookingQuote.get(input);
}

export async function cancelBookingQuote(input: CancelBookingQuoteInput) {
	return orpc.bookingQuote.cancel(input);
}
