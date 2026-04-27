import { LOCALES } from "@zanadeal/api/constants";
import type {
	RoomAdminComputed,
	UpsertRoomInput,
} from "@zanadeal/api/features/room";

const createEmptyDescriptionTranslations =
	(): UpsertRoomInput["descriptionTranslations"] =>
		LOCALES.map((locale) => ({
			locale,
			description: "",
		}));

export const ROOM_UPSERT_DEFAULT_VALUES: UpsertRoomInput = {
	amenityIds: [],
	descriptionTranslations: createEmptyDescriptionTranslations(),
	title: "",
	beds: 1,
	maxGuests: 1,
	baths: 1,
	areaM2: 1,
	images: [],
	prices: [],
	quantity: 1,
	type: "PREMIUM",
	hotelId: "",
};

const mapRoomToCreateRoomInput = (room: RoomAdminComputed): UpsertRoomInput => {
	return {
		...room,
		descriptionTranslations: Object.entries(room.descriptionTranslations).map(
			([locale, value]) => ({
				locale:
					locale as UpsertRoomInput["descriptionTranslations"][number]["locale"],
				...value,
			}),
		),
		amenityIds: room.amenities.map((amenity) => amenity.id),
		images: [],
	};
};

export const getInitValues = (
	hotelId: string,
	room?: RoomAdminComputed,
): UpsertRoomInput => {
	return room
		? mapRoomToCreateRoomInput(room)
		: { ...ROOM_UPSERT_DEFAULT_VALUES, hotelId };
};
