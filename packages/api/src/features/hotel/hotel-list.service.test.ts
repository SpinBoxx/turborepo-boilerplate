import { beforeEach, describe, expect, it, vi } from "vitest";
import { Role } from "../../../../db/prisma/generated/enums";
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
});
