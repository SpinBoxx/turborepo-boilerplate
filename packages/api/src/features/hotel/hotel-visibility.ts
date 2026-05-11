import type { Prisma } from "../../../../db/prisma/generated/client";
import { Role } from "../../../../db/prisma/generated/enums";
import type { UserComputed } from "../user";
import { getRolesByPriority } from "../user/user-roles";
import type { HotelComputed } from "./schemas/hotel.schema";

type HotelVisibilityFields = Pick<HotelComputed, "startingPrice">;

const isHotelVisibleForRole = (
	hotel: HotelVisibilityFields,
	viewerRole: Role,
): boolean => {
	if (viewerRole === Role.ADMIN) {
		return true;
	}

	return hotel.startingPrice > 0;
};

export const getHotelViewerRole = (
	user: UserComputed | null | undefined,
): Role => {
	const rolesSortedByPriority = getRolesByPriority(user?.roles);
	return rolesSortedByPriority[0] ?? Role.USER;
};

export const isHotelVisibleToUser = (
	hotel: HotelVisibilityFields,
	user: UserComputed | null | undefined,
): boolean => {
	return isHotelVisibleForRole(hotel, getHotelViewerRole(user));
};

export const filterVisibleHotelsForUser = <
	THotel extends HotelVisibilityFields,
>(
	hotels: THotel[],
	user: UserComputed | null | undefined,
): THotel[] => {
	const viewerRole = getHotelViewerRole(user);

	if (viewerRole === Role.ADMIN) {
		return hotels;
	}

	return hotels.filter((hotel) => isHotelVisibleForRole(hotel, viewerRole));
};

export const buildHotelVisibilityWhere = (
	user: UserComputed | null | undefined,
): Prisma.HotelWhereInput => {
	if (getHotelViewerRole(user) === Role.ADMIN) {
		return {};
	}

	return {
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
	};
};
