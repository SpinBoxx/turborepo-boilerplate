import { describe, expect, it } from "vitest";
import {
	applyRoomCollectionRules,
	buildRoomCollectionRules,
	computeHotelRooms,
	type RoomCollectionContext,
} from "./hotel.service";

const rooms = [
	{ id: "room_1", availableCapacity: 0, price: 120 },
	{ id: "room_2", availableCapacity: 2, price: 90 },
	{ id: "room_3", availableCapacity: 1, price: 150 },
] as never;

function createContext(
	overrides?: Partial<RoomCollectionContext>,
): RoomCollectionContext {
	return {
		mode: "detail",
		viewerRole: "USER" as never,
		...overrides,
	};
}

describe("hotel.service room collection rules", () => {
	it("adds the unavailable-room filter only when a date range is provided", () => {
		expect(buildRoomCollectionRules(createContext())).toHaveLength(0);

		expect(
			buildRoomCollectionRules(
				createContext({
					checkInDate: new Date("2026-06-10T00:00:00.000Z"),
					checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
				}),
			),
		).toHaveLength(1);
	});

	it("filters unavailable rooms through the room collection pipeline", () => {
		const filteredRooms = applyRoomCollectionRules(
			rooms,
			createContext({
				checkInDate: new Date("2026-06-10T00:00:00.000Z"),
				checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
			}),
		);

		expect(filteredRooms).toEqual([
			{ id: "room_2", availableCapacity: 2, price: 90 },
			{ id: "room_3", availableCapacity: 1, price: 150 },
		]);
	});

	it("passes availability context to room compute before applying room rules", async () => {
		const hotel = {
			rooms: [
				{
					id: "room_1",
					hotelId: "hotel_1",
					type: "STANDARD",
					title: "Room 1",
					descriptionTranslations: {
						fr: { description: "Room 1" },
						en: { description: "Room 1" },
						mg: { description: "Room 1" },
					},
					beds: 1,
					maxGuests: 2,
					baths: 1,
					areaM2: 20,
					quantity: 1,
					images: [],
					amenities: [],
					prices: [],
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
					updatedAt: new Date("2026-01-01T00:00:00.000Z"),
				},
				{
					id: "room_2",
					hotelId: "hotel_1",
					type: "STANDARD",
					title: "Room 2",
					descriptionTranslations: {
						fr: { description: "Room 2" },
						en: { description: "Room 2" },
						mg: { description: "Room 2" },
					},
					beds: 1,
					maxGuests: 2,
					baths: 1,
					areaM2: 20,
					quantity: 2,
					images: [],
					amenities: [],
					prices: [],
					createdAt: new Date("2026-01-01T00:00:00.000Z"),
					updatedAt: new Date("2026-01-01T00:00:00.000Z"),
				},
			],
		} as never;

		const computedRooms = await computeHotelRooms(hotel, undefined, {
			checkInDate: new Date("2026-06-10T00:00:00.000Z"),
			checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
			roomAvailabilityById: new Map([
				["room_1", 1],
				["room_2", 1],
			]),
		});

		expect(computedRooms.map((room) => room.id)).toEqual(["room_2"]);
		expect(computedRooms[0]?.availableCapacity).toBe(1);
	});
});
