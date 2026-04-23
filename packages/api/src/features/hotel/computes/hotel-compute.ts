import { Role } from "../../../../../db/prisma/generated/enums";
import type { UserComputed } from "../../user";
import { getRolesByPriority } from "../../user/user-roles";
import type { HotelDB } from "../hotel.store";
import {
	type HotelAdminComputed,
	type HotelComputed,
	type HotelUserComputed,
	HotelAdminComputedSchema,
	HotelUserComputedSchema,
} from "../schemas/hotel.schema";
import type { HotelComputeOptions } from "../services/hotel.service";
import { computeHotelFull } from "../services/hotel.service";

function resolveHotelViewerRole(
	user: UserComputed | null | undefined,
): Role {
	const highestRole = getRolesByPriority(user?.roles)[0];
	return highestRole ?? Role.USER;
}

function projectHotelForRole(
	hotel: Awaited<ReturnType<typeof computeHotelFull>>,
	role: Role,
): HotelComputed {
	if (role === Role.ADMIN) {
		return HotelAdminComputedSchema.parse(hotel) satisfies HotelAdminComputed;
	}

	return HotelUserComputedSchema.parse(hotel) satisfies HotelUserComputed;
}

export const computeHotel = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
): Promise<HotelComputed> => {
	const role = resolveHotelViewerRole(user);
	const computedHotel = await computeHotelFull(hotel, user, options);

	return projectHotelForRole(computedHotel, role);
};
