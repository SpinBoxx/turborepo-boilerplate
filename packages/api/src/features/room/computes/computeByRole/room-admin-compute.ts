import type { UserComputed } from "../../../user";
import { computeRoomFull } from "../../room.service";
import type { RoomDB } from "../../room.store";
import {
	type RoomAdminComputed,
	RoomAdminComputedSchema,
} from "../../schemas/room.schemas";

export const roomAdminCompute = async (
	room: RoomDB,
	user: UserComputed | null | undefined,
): Promise<RoomAdminComputed> => {
	const computed = await computeRoomFull(room, user);
	return RoomAdminComputedSchema.parse(computed);
};
