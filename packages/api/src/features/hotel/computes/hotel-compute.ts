import { Role } from "../../../../../db/prisma/generated/enums";
import type { UserComputed } from "../../user";
import { getRolesByPriority } from "../../user/user-roles";
import type { HotelDB } from "../hotel.store";
import type { HotelComputed } from "../schemas/hotel.schema";
import type { HotelComputeOptions } from "../services/hotel.service";
import { hotelAdminCompute } from "./computeByRole/hotel-admin-compute";
import { hotelUserCompute } from "./computeByRole/hotel-user-compute";

export const computeHotel = async (
	hotel: HotelDB,
	user: UserComputed | null | undefined,
	options?: HotelComputeOptions,
): Promise<HotelComputed> => {
	const rolesSortedByPriority = getRolesByPriority(user?.roles);
	const highestRole = rolesSortedByPriority[0];
	const compute = {
		[Role.ADMIN]: async () => await hotelAdminCompute(hotel, user, options),
		[Role.USER]: async () => await hotelUserCompute(hotel, user, options),
	};

	if (!highestRole || highestRole === Role.USER) {
		return await compute[Role.USER].call(hotel);
	}
	return await compute[highestRole].call(hotel);
};
