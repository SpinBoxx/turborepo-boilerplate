import type {
	Room,
	UpsertRoomInput,
} from "@zanadeal/api/features/room/room.schemas";

export const ROOM_UPSERT_DEFAULT_VALUES: UpsertRoomInput = {
	amenityIds: [],
	capacity: 1,
	description: "",
	images: [],
	prices: [],
	quantity: 1,
	type: "PREMIUM",
	hotelId: "",
};

const mapRoomToCreateRoomInput = (room: Room): UpsertRoomInput => {
	return {
		...room,
		amenityIds: room.amenities.map((amenity) => amenity.id),
		images: [],
	};
};

export const getInitValues = (
	hotelId: string,
	room?: Room,
): UpsertRoomInput => {
	return room
		? mapRoomToCreateRoomInput(room)
		: { ...ROOM_UPSERT_DEFAULT_VALUES, hotelId };
};
