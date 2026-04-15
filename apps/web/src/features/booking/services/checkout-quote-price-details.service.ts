import type { BookingQuoteComputed } from "@zanadeal/api/features/booking-quote";

type CheckoutQuotePriceDetailsInput = Pick<
	BookingQuoteComputed,
	"discountAmount" | "nights" | "subtotalAmount" | "taxAmount" | "totalAmount"
>;

export function getCheckoutQuotePriceDetails(
	quote: CheckoutQuotePriceDetailsInput,
) {
	return {
		hasDiscount: quote.discountAmount > 0,
		nights: quote.nights,
		subtotalAmount: quote.subtotalAmount,
		discountAmount: quote.discountAmount,
		taxAmount: quote.taxAmount,
		totalAmount: quote.totalAmount,
	};
}