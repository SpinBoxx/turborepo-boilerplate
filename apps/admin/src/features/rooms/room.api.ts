import type {
	DeleteRoomInput,
	ListRoomsInput,
	UpsertRoomInput,
} from "@zanadeal/api/features/room/room.schemas";
import { orpc } from "@/lib/orpc";

export async function listRooms(input: ListRoomsInput) {
	return orpc.room.list(input);
}

export async function createRoom(input: UpsertRoomInput) {
	return orpc.room.create(input);
}

export async function deleteRoom(input: DeleteRoomInput) {
	return orpc.room.delete(input);
}
