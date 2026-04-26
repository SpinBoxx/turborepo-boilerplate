import { describe, expect, it } from "vitest";
import {
	computeAvailableCapacity,
	computeRoomFull,
	type RoomComputeOptions,
} from "./room.service";

function createRoom(overrides?: Record<string, unknown>) {
	return {
		id: "room_1",
		hotelId: "hotel_1",
		type: "STANDARD",
		title: "Standard Room",
		descriptionTranslations: {
			fr: { description: "A quiet room" },
			en: { description: "A quiet room" },
			mg: { description: "A quiet room" },
		},
		beds: 1,
		maxGuests: 2,
		baths: 1,
		areaM2: 24,
		quantity: 3,
		images: [],
		amenities: [],
		prices: [],
		bookings: [],
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: new Date("2026-01-01T00:00:00.000Z"),
		...overrides,
	} as never;
}

describe("room.service", () => {
	it("returns room quantity as available capacity when no date range is provided", () => {
		const room = createRoom({ quantity: 4 });

		expect(computeAvailableCapacity(room)).toBe(4);
	});

	it("subtracts reserved quantity for the room when a date range is provided", () => {
		const room = createRoom({ id: "room_42", quantity: 5 });
		const options: RoomComputeOptions = {
			availabilityByRoomId: new Map([["room_42", 2]]),
			checkInDate: new Date("2026-06-10T00:00:00.000Z"),
			checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
		};

		expect(computeAvailableCapacity(room, options)).toBe(3);
	});

	it("caps available capacity at zero when reserved quantity exceeds stock", () => {
		const room = createRoom({ id: "room_99", quantity: 1 });
		const options: RoomComputeOptions = {
			availabilityByRoomId: new Map([["room_99", 4]]),
			checkInDate: new Date("2026-06-10T00:00:00.000Z"),
			checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
		};

		expect(computeAvailableCapacity(room, options)).toBe(0);
	});

	it("exposes availableCapacity on the computed room", async () => {
		const room = createRoom({ id: "room_7", quantity: 2 });
		const options: RoomComputeOptions = {
			availabilityByRoomId: new Map([["room_7", 1]]),
			checkInDate: new Date("2026-06-10T00:00:00.000Z"),
			checkOutDate: new Date("2026-06-12T00:00:00.000Z"),
		};

		const computedRoom = await computeRoomFull(room, undefined, options);

		expect(computedRoom.availableCapacity).toBe(1);
	});
});