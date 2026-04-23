import { hasFullDateCoverage } from "@zanadeal/utils";
import { Role } from "../../../../../db/prisma/generated/enums";
import { fromStoredMoneyAmount } from "../../../money";
import { computeAmenity } from "../../amenity/computes/amenity-compute";
import { computeRoom } from "../../room/computes/room-compute";
import type { RoomComputeOptions } from "../../room/room.service";
import type { UserComputed } from "../../user";
import type { HotelDB } from "../hotel.store";
import type { HotelComputed } from "../schemas/hotel.schema";

export interface HotelComputeOptions {
	checkInDate?: Date;
	checkOutDate?: Date;
	roomAvailabilityById?: Map<string, number>;
}

export interface RoomCollectionContext {
	checkInDate?: Date;
	checkOutDate?: Date;
	mode: "detail" | "list";
	viewerRole: Role;
}

export type RoomCollectionRule = (
	rooms: HotelComputed["rooms"],
	context: RoomCollectionContext,
) => HotelComputed["rooms"];

export const computeHotelRating = (hotel: HotelDB): number => {
	if (!hotel.reviews || hotel.reviews.length === 0) {
		return 0;
	}
	const totalRating = hotel.reviews.reduce(
		(sum, review) => sum + review.rating,
		0,
	);
	return totalRating / hotel.reviews.length;
};

export const computeHotelStartingPrice = (hotel: HotelDB): number => {
	if (!hotel.rooms || hotel.rooms.length === 0) {
		return 0;
	}
	const allPrices = hotel.rooms.flatMap((room) =>
		room.prices.map((price) => price.price),
	);
	if (allPrices.length === 0) {
		return 0;
	}
	return fromStoredMoneyAmount(Math.min(...allPrices));
};

export const computeHotelAmenities = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
): Promise<HotelComputed["amenities"]> => {
	return await Promise.all(
		hotel.amenities.map(async (amenity) => await computeAmenity(amenity, user)),
	);
};

export const filterUnavailableRooms: RoomCollectionRule = (rooms, context) => {
	if (!context.checkInDate || !context.checkOutDate) {
		return rooms;
	}

	return rooms.filter((room) => room.availableCapacity > 0);
};

export const buildRoomCollectionRules = (
	context: RoomCollectionContext,
): RoomCollectionRule[] => {
	const rules: RoomCollectionRule[] = [];

	if (context.checkInDate && context.checkOutDate) {
		rules.push(filterUnavailableRooms);
	}

	return rules;
};

export const applyRoomCollectionRules = (
	rooms: HotelComputed["rooms"],
	context: RoomCollectionContext,
): HotelComputed["rooms"] => {
	return buildRoomCollectionRules(context).reduce(
		(currentRooms, rule) => rule(currentRooms, context),
		rooms,
	);
};

function buildRoomComputeOptions(
	options?: HotelComputeOptions,
): RoomComputeOptions | undefined {
	if (!options?.checkInDate || !options?.checkOutDate) {
		return undefined;
	}

	return {
		checkInDate: options.checkInDate,
		checkOutDate: options.checkOutDate,
		availabilityByRoomId: options.roomAvailabilityById,
	};
}

function buildRoomCollectionContext(
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
): RoomCollectionContext {
	return {
		checkInDate: options?.checkInDate,
		checkOutDate: options?.checkOutDate,
		mode: "detail",
		viewerRole: user?.roles?.includes(Role.ADMIN) ? Role.ADMIN : Role.USER,
	};
}

export const computeHotelRooms = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
): Promise<HotelComputed["rooms"]> => {
	const roomComputeOptions = buildRoomComputeOptions(options);
	const computedRooms = await Promise.all(
		hotel.rooms.map(
			async (room) => await computeRoom(room, user, roomComputeOptions),
		),
	);

	return applyRoomCollectionRules(
		computedRooms,
		buildRoomCollectionContext(user, options),
	);
};

/** General compute — builds the full hotel object with all computed fields */
export const computeHotelFull = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
) => {
	// When a date range is provided, keep only rooms fully covered by prices
	const checkIn = options?.checkInDate;
	const checkOut = options?.checkOutDate;
	const effectiveHotel =
		checkIn && checkOut
			? {
					...hotel,
					rooms: hotel.rooms.filter((room) =>
						hasFullDateCoverage(room.prices, checkIn, checkOut),
					),
				}
			: hotel;

	return {
		...effectiveHotel,
		rating: computeHotelRating(effectiveHotel),
		startingPrice: computeHotelStartingPrice(effectiveHotel),
		amenities: await computeHotelAmenities(effectiveHotel, user),
		rooms: await computeHotelRooms(effectiveHotel, user, options),
	};
};
