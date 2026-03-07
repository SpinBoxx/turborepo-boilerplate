import { Role } from "../../../../../db/prisma/generated/enums";
import type { UserComputed } from "../../user";
import { getRolesByPriority } from "../../user/user-roles";
import type { AmenityDB } from "../amenity.store";
import type { AmenityComputed } from "../schemas/amenity.schemas";
import { amenityAdminCompute } from "./computeByRole/amenity-admin-compute";
import { amenityUserCompute } from "./computeByRole/amenity-user-compute";

export const computeAmenity = async (
	amenity: AmenityDB,
	user: UserComputed | null | undefined,
): Promise<AmenityComputed> => {
	const rolesSortedByPriority = getRolesByPriority(user?.roles);
	const highestRole = rolesSortedByPriority[0];
	const compute = {
		[Role.ADMIN]: async () => await amenityAdminCompute(amenity),
		[Role.USER]: async () => await amenityUserCompute(amenity),
	};

	if (!highestRole) {
		return await compute[Role.USER].call(amenity);
	}
	return await compute[highestRole].call(amenity);
};
