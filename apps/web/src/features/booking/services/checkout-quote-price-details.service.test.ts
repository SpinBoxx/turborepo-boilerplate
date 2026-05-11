import { describe, expect, it } from "vitest";
import { getCheckoutQuotePriceDetails } from "./checkout-quote-price-details.service";

describe("checkout-quote-price-details.service", () => {
	it("returns the exact monetary fields from the quote for checkout display", () => {
		const result = getCheckoutQuotePriceDetails({
			discountAmount: 5000,
			nights: 3,
			subtotalAmount: 60000,
			taxAmount: 7500,
			totalAmount: 62500,
		} as const);

		expect(result).toEqual({
			hasDiscount: true,
			nights: 3,
			subtotalAmount: 60000,
			discountAmount: 5000,
			taxAmount: 7500,
			totalAmount: 62500,
		});
	});

	it("hides the discount row when the quote has no discount", () => {
		const result = getCheckoutQuotePriceDetails({
			discountAmount: 0,
			nights: 1,
			subtotalAmount: 25000,
			taxAmount: 0,
			totalAmount: 25000,
		} as const);

		expect(result.hasDiscount).toBe(false);
	});
});