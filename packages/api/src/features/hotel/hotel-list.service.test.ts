import { stringToDate } from "@zanadeal/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "../../../../db/prisma/generated/enums";
import { getReservedRoomQuantitiesByIds } from "../room/room.store";
import { computeHotel } from "./computes/hotel-compute";
import { countHotelsFromDb, listHotelsFromDb } from "./hotel.store";
import { listHotels } from "./hotel-list.service";
import { ListHotelsInputSchema } from "./schemas/hotel.schema";

vi.mock("./hotel.store", () => ({
	listHotelsFromDb: vi.fn(),
	countHotelsFromDb: vi.fn(),
}));

vi.mock("./computes/hotel-compute", () => ({
	computeHotel: vi.fn(),
}));

vi.mock("../room/room.store", () => ({
	getReservedRoomQuantitiesByIds: vi.fn(),
}));

describe("hotel list service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("paginates in database when only db fields are used", async () => {
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{ id: "1", name: "Alpha" },
		] as never);
		vi.mocked(countHotelsFromDb).mockResolvedValue(12);
		vi.mocked(computeHotel).mockResolvedValue({
			id: "1",
			name: "Alpha",
			startingPrice: 100,
			rating: 4,
		} as never);

		const input = ListHotelsInputSchema.parse({
			sort: {
				field: "name",
				direction: "asc",
			},
			page: 2,
			limit: 5,
			filters: {
				name: {
					contains: "Al",
				},
			},
		});

		const result = await listHotels(input, { roles: [Role.ADMIN] } as never);
		const listArgs = vi.mocked(listHotelsFromDb).mock.calls[0]?.[0];

		expect(listHotelsFromDb).toHaveBeenCalledWith(
			expect.objectContaining({
				take: 5,
				skip: 5,
				where: expect.objectContaining({
					isArchived: undefined,
					name: {
						contains: "Al",
						mode: "insensitive",
					},
				}),
			}),
		);
		expect(listArgs?.where).not.toHaveProperty("rooms");
		expect(listArgs?.where).not.toHaveProperty("NOT");
		expect(countHotelsFromDb).toHaveBeenCalledOnce();
		expect(result).toEqual({
			items: [
				{
					id: "1",
					name: "Alpha",
					startingPrice: 100,
					rating: 4,
				},
			],
			total: 12,
			page: 2,
			limit: 5,
			pageCount: 3,
		});
	});

	it("adds the zero-price visibility clause for user queries", async () => {
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{ id: "1", name: "Alpha" },
		] as never);
		vi.mocked(countHotelsFromDb).mockResolvedValue(1);
		vi.mocked(computeHotel).mockResolvedValue({
			id: "1",
			name: "Alpha",
			startingPrice: 100,
			rating: 4,
		} as never);

		const input = ListHotelsInputSchema.parse({
			sort: {
				field: "name",
				direction: "asc",
			},
			page: 1,
			limit: 10,
		});

		await listHotels(input, { roles: [Role.USER] } as never);

		expect(listHotelsFromDb).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					isArchived: false,
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
				}),
			}),
		);
		expect(countHotelsFromDb).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
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
				}),
			}),
		);
	});

	it("filters popular hotels in database", async () => {
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{ id: "1", name: "Popular Hotel" },
		] as never);
		vi.mocked(countHotelsFromDb).mockResolvedValue(1);
		vi.mocked(computeHotel).mockResolvedValue({
			id: "1",
			name: "Popular Hotel",
			isPopular: true,
			startingPrice: 100,
			rating: 4,
		} as never);

		const input = ListHotelsInputSchema.parse({
			sort: {
				field: "isPopular",
				direction: "desc",
			},
			filters: {
				isPopular: {
					equal: true,
				},
			},
			page: 1,
			limit: 6,
		});

		const result = await listHotels(input, undefined);

		expect(listHotelsFromDb).toHaveBeenCalledWith(
			expect.objectContaining({
				take: 6,
				skip: 0,
				orderBy: [{ isPopular: "desc" }, { updatedAt: "desc" }, { id: "desc" }],
				where: expect.objectContaining({
					isArchived: false,
					isPopular: true,
				}),
			}),
		);
		expect(countHotelsFromDb).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({ isPopular: true }),
			}),
		);
		expect(result.items).toEqual([
			{
				id: "1",
				name: "Popular Hotel",
				isPopular: true,
				startingPrice: 100,
				rating: 4,
			},
		]);
	});

	it("applies computed filters and sort after compute", async () => {
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{ id: "1", name: "Hotel A" },
			{ id: "2", name: "Hotel B" },
			{ id: "3", name: "Hotel C" },
		] as never);
		vi.mocked(computeHotel)
			.mockResolvedValueOnce({
				id: "1",
				name: "Hotel A",
				startingPrice: 150,
				rating: 4.6,
			} as never)
			.mockResolvedValueOnce({
				id: "2",
				name: "Hotel B",
				startingPrice: 90,
				rating: 4.1,
			} as never)
			.mockResolvedValueOnce({
				id: "3",
				name: "Hotel C",
				startingPrice: 200,
				rating: 4.8,
			} as never);

		const input = ListHotelsInputSchema.parse({
			sort: {
				field: "startingPrice",
				direction: "asc",
			},
			filters: {
				startingPrice: {
					gte: 100,
				},
			},
			page: 1,
			limit: 1,
		});

		const result = await listHotels(input, undefined);

		expect(listHotelsFromDb).toHaveBeenCalledWith(
			expect.objectContaining({
				orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
				where: expect.objectContaining({
					isArchived: false,
				}),
			}),
		);
		expect(countHotelsFromDb).not.toHaveBeenCalled();
		expect(result).toEqual({
			items: [{ id: "1", name: "Hotel A", startingPrice: 150, rating: 4.6 }],
			total: 2,
			page: 1,
			limit: 1,
			pageCount: 2,
		});
	});

	it("filters out zero-price hotels for user after compute", async () => {
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{ id: "1", name: "Hidden Hotel" },
			{ id: "2", name: "Visible Hotel" },
			{ id: "3", name: "Premium Hotel" },
		] as never);
		vi.mocked(computeHotel)
			.mockResolvedValueOnce({
				id: "1",
				name: "Hidden Hotel",
				startingPrice: 0,
				rating: 4.4,
			} as never)
			.mockResolvedValueOnce({
				id: "2",
				name: "Visible Hotel",
				startingPrice: 90,
				rating: 4.1,
			} as never)
			.mockResolvedValueOnce({
				id: "3",
				name: "Premium Hotel",
				startingPrice: 200,
				rating: 4.8,
			} as never);

		const input = ListHotelsInputSchema.parse({
			sort: {
				field: "startingPrice",
				direction: "asc",
			},
			page: 1,
			limit: 10,
		});

		const result = await listHotels(input, undefined);

		expect(countHotelsFromDb).not.toHaveBeenCalled();
		expect(result).toEqual({
			items: [
				{ id: "2", name: "Visible Hotel", startingPrice: 90, rating: 4.1 },
				{ id: "3", name: "Premium Hotel", startingPrice: 200, rating: 4.8 },
			],
			total: 2,
			page: 1,
			limit: 10,
			pageCount: 1,
		});
	});

	it("keeps unavailable hotels visible for date-scoped searches", async () => {
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{ id: "1", name: "Unavailable Hotel", rooms: [{ id: "room_1" }] },
			{ id: "2", name: "Available Hotel", rooms: [{ id: "room_2" }] },
		] as never);
		vi.mocked(getReservedRoomQuantitiesByIds).mockResolvedValue(new Map());
		vi.mocked(computeHotel)
			.mockResolvedValueOnce({
				id: "1",
				name: "Unavailable Hotel",
				startingPrice: 0,
				rating: 4.4,
				isAvailableForDates: false,
			} as never)
			.mockResolvedValueOnce({
				id: "2",
				name: "Available Hotel",
				startingPrice: 90,
				rating: 4.1,
				isAvailableForDates: true,
			} as never);

		const input = ListHotelsInputSchema.parse({
			checkInDate: "2026-06-10",
			checkOutDate: "2026-06-12",
			sort: {
				field: "startingPrice",
				direction: "asc",
			},
			page: 1,
			limit: 10,
		});

		const result = await listHotels(input, undefined);

		expect(result).toEqual({
			items: [
				{
					id: "1",
					name: "Unavailable Hotel",
					startingPrice: 0,
					rating: 4.4,
					isAvailableForDates: false,
				},
				{
					id: "2",
					name: "Available Hotel",
					startingPrice: 90,
					rating: 4.1,
					isAvailableForDates: true,
				},
			],
			total: 2,
			page: 1,
			limit: 10,
			pageCount: 1,
		});
	});

	it("resolves room availability and forwards it to hotel compute when dates are provided", async () => {
		const roomAvailabilityById = new Map([["room_1", 2]]);
		vi.mocked(listHotelsFromDb).mockResolvedValue([
			{
				id: "1",
				name: "Hotel A",
				rooms: [{ id: "room_1" }],
			},
		] as never);
		vi.mocked(getReservedRoomQuantitiesByIds).mockResolvedValue(
			roomAvailabilityById,
		);
		vi.mocked(computeHotel).mockResolvedValue({
			id: "1",
			name: "Hotel A",
			startingPrice: 150,
			rating: 4.6,
			rooms: [],
		} as never);

		const input = ListHotelsInputSchema.parse({
			checkInDate: "2026-06-10",
			checkOutDate: "2026-06-12",
			page: 1,
			limit: 10,
		});

		await listHotels(input, undefined);

		expect(getReservedRoomQuantitiesByIds).toHaveBeenCalledWith({
			checkInDate: stringToDate("2026-06-10"),
			checkOutDate: stringToDate("2026-06-12"),
			roomIds: ["room_1"],
		});
		expect(computeHotel).toHaveBeenCalledWith(
			expect.objectContaining({ id: "1" }),
			undefined,
			expect.objectContaining({
				checkInDate: stringToDate("2026-06-10"),
				checkOutDate: stringToDate("2026-06-12"),
				roomAvailabilityById,
			}),
		);
	});
});
