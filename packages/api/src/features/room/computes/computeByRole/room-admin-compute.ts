import type { UserComputed } from "../../../user";
import { type RoomComputeOptions, computeRoomFull } from "../../room.service";
import type { RoomDB } from "../../room.store";
import {
	type RoomAdminComputed,
	RoomAdminComputedSchema,
} from "../../schemas/room.schemas";

export const roomAdminCompute = async (
	room: RoomDB,
	user: UserComputed | null | undefined,
	options?: RoomComputeOptions,
): Promise<RoomAdminComputed> => {
	const computed = await computeRoomFull(room, user, options);
	return RoomAdminComputedSchema.parse(computed);
};
