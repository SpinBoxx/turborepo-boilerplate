import { describe, expect, it } from "vitest";
import { computeHotelStartingPrice } from "./features/hotel/services/hotel.service";
import { computeRoomPriceFields } from "./features/room/room.service";
import { fromStoredMoneyAmount, toStoredMoneyAmount } from "./money";

describe("money storage conversion", () => {
	it("converts human amounts to stored x100 amounts", () => {
		expect(toStoredMoneyAmount(12.34)).toBe(1234);
		expect(toStoredMoneyAmount(9.99)).toBe(999);
	});

	it("converts stored x100 amounts back to human amounts", () => {
		expect(fromStoredMoneyAmount(1234)).toBe(12.34);
		expect(fromStoredMoneyAmount(999)).toBe(9.99);
	});

	it("normalizes room computed prices from stored values", () => {
		const room = {
			prices: [
				{
					price: 1234,
					promoPrice: 999,
					startDate: new Date("2024-01-01T00:00:00.000Z"),
					endDate: null,
				},
			],
		} as never;

		expect(computeRoomPriceFields(room)).toEqual({
			price: 12.34,
			promoPrice: 9.99,
		});
	});

	it("normalizes hotel starting price from stored room prices", () => {
		const hotel = {
			rooms: [
				{
					prices: [{ price: 4000 }, { price: 2550 }],
				},
				{
					prices: [{ price: 3100 }],
				},
			],
		} as never;

		expect(computeHotelStartingPrice(hotel)).toBe(25.5);
	});
});