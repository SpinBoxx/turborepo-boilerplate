import { Role } from "../../../../db/prisma/generated/enums";
import type { UserComputed } from "./schemas/user.schema";

export const getRolesByPriority = (
	roles: UserComputed["roles"] | undefined,
) => {
	if (!roles?.length) {
		return [Role.USER];
	}

	const ROLE_PRIORITY = {
		ADMIN: 0,
		HOTEL_REVIEWER: 1,
		USER: 2,
	};

	return roles.sort((a, b) => ROLE_PRIORITY[a] - ROLE_PRIORITY[b]);
};
