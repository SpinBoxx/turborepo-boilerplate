import type {
	CreateRoomInput,
	Room,
} from "@zanadeal/api/features/room/room.schemas";

const mapRoomToCreateRoomInput = (room: Room): CreateRoomInput => {
	return {
		...room,
		amenityIds: room.amenities.map((amenity) => amenity.id),
		images: room.images.map((image) => ({
			publicId: image.publicId,
			roomId: image.roomId,
			url: image.url,
		})),
	};
};

export const getInitValues = (
	hotelId: string,
	room?: Room,
): CreateRoomInput => {
	return room
		? mapRoomToCreateRoomInput(room)
		: {
				amenityIds: [],
				capacity: 1,
				description: "",
				images: [],
				prices: [],
				quantity: 1,
				type: "PREMIUM",
				hotelId: hotelId,
			};
};
