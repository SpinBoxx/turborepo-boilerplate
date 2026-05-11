import { describe, expect, it } from "vitest";
import { currency, getCurrencySymbol } from "./string";

describe("currency", () => {
	it("formats Ariary with grouped integer amounts", () => {
		expect(currency(250000)).toBe("250 000 Ar");
	});

	it("formats zero Ariary", () => {
		expect(currency(0)).toBe("0 Ar");
	});

	it("formats negative amounts", () => {
		expect(currency(-250000)).toBe("-250 000 Ar");
	});

	it("rounds Ariary amounts to whole values by default", () => {
		expect(currency(1234.56)).toBe("1 235 Ar");
	});

	it("supports explicit fraction digits when needed", () => {
		expect(
			currency(1234.56, {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2,
			}),
		).toBe("1 234,56 Ar");
	});

	it("formats compact thousands and millions", () => {
		expect(currency(1000, { compact: true })).toBe("1k Ar");
		expect(currency(1500, { compact: true })).toBe("1.5k Ar");
		expect(currency(1000000, { compact: true })).toBe("1M Ar");
		expect(currency(2000000, { compact: true })).toBe("2M Ar");
		expect(currency(2500000, { compact: true })).toBe("2.5M Ar");
	});

	it("keeps small compact amounts unshortened", () => {
		expect(currency(999, { compact: true })).toBe("999 Ar");
	});

	it("throws for unsupported currencies", () => {
		expect(() => currency(1000, { currency: "EUR" })).toThrow(
			"Unsupported currency: EUR",
		);
	});

	it("returns the configured currency symbol", () => {
		expect(getCurrencySymbol()).toBe("Ar");
	});
});