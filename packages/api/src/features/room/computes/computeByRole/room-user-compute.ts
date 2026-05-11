import type { UserComputed } from "../../../user";
import { type RoomComputeOptions, computeRoomFull } from "../../room.service";
import type { RoomDB } from "../../room.store";
import {
	type RoomUserComputed,
	RoomUserComputedSchema,
} from "../../schemas/room.schemas";

export const roomUserCompute = async (
	room: RoomDB,
	user: UserComputed | null | undefined,
	options?: RoomComputeOptions,
): Promise<RoomUserComputed> => {
	const computed = await computeRoomFull(room, user, options);
	return RoomUserComputedSchema.parse(computed);
};
