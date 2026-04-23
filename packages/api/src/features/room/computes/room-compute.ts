import { Role } from "../../../../../db/prisma/generated/enums";
import type { UserComputed } from "../../user";
import { getRolesByPriority } from "../../user/user-roles";
import type { RoomDB } from "../room.store";
import type { RoomComputed } from "../schemas/room.schemas";
import type { RoomComputeOptions } from "../room.service";
import { roomAdminCompute } from "./computeByRole/room-admin-compute";
import { roomUserCompute } from "./computeByRole/room-user-compute";

export const computeRoom = async (
	room: RoomDB,
	user: UserComputed | null | undefined,
	options?: RoomComputeOptions,
): Promise<RoomComputed> => {
	const rolesSortedByPriority = getRolesByPriority(user?.roles);
	const highestRole = rolesSortedByPriority[0];
	const compute = {
		[Role.ADMIN]: async () => await roomAdminCompute(room, user, options),
		[Role.USER]: async () => await roomUserCompute(room, user, options),
	};

	if (!highestRole) {
		return await compute[Role.USER].call(room);
	}
	return await compute[highestRole].call(room);
};
