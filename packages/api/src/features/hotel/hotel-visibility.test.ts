import { describe, expect, it } from "vitest";
import { Role } from "../../../../db/prisma/generated/enums";
import {
	buildHotelVisibilityWhere,
	isHotelVisibleToUser,
} from "./hotel-visibility";

describe("hotel visibility", () => {
	it("hides zero-price hotels for user viewers", () => {
		expect(
			isHotelVisibleToUser({ startingPrice: 0 } as never, {
				roles: [Role.USER],
			} as never),
		).toBe(false);
		expect(
			isHotelVisibleToUser({ startingPrice: 120 } as never, {
				roles: [Role.USER],
			} as never),
		).toBe(true);
		expect(isHotelVisibleToUser({ startingPrice: 0 } as never, undefined)).toBe(
			false,
		);
	});

	it("keeps zero-price hotels visible for admin viewers", () => {
		expect(
			isHotelVisibleToUser({ startingPrice: 0 } as never, {
				roles: [Role.ADMIN],
			} as never),
		).toBe(true);
	});

	it("builds an exact where clause for non-admin visibility", () => {
		expect(buildHotelVisibilityWhere({ roles: [Role.ADMIN] } as never)).toEqual(
			{},
		);
		expect(buildHotelVisibilityWhere({ roles: [Role.USER] } as never)).toEqual({
			rooms: {
				some: {
					prices: {
						some: {
							price: {
								gt: 0,
							},
						},
					},
				},
			},
			NOT: {
				rooms: {
					some: {
						prices: {
							some: {
								price: {
									lte: 0,
								},
							},
						},
					},
				},
			},
		});
	});
});