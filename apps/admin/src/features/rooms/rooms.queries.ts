import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateRoomInput,
	DeleteRoomInput,
	ListRoomsInput,
} from "@zanadeal/api/features/room/room.schemas";
import { toast } from "sonner";
import { getErrorMessage } from "../amenity/amenity.queries";
import { createRoom, deleteRoom, listRooms } from "./room.api";

export function roomKeys() {
	return {
		all: ["room"] as const,
		list: (input: ListRoomsInput) =>
			[
				"room",
				"list",
				input.where.hotelId ?? null,
				input.where.type ?? null,
				input.where.startDate?.toISOString() ?? null,
				input.where.endDate?.toISOString() ?? null,
				input.orderBy?.price ?? null,
			] as const,
	};
}

export function useRooms(input: ListRoomsInput) {
	return useQuery({
		queryKey: roomKeys().list(input),
		queryFn: () => listRooms(input),
	});
}

export function useCreateRoom() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateRoomInput) => createRoom(input),
		onError: (error) => {
			toast.error("Création impossible", {
				description: getErrorMessage(error),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: roomKeys().all });
			toast.success("Chambre créée avec succès");
		},
	});
}

export function useDeleteRoom() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: DeleteRoomInput) => deleteRoom(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: roomKeys().all });
			toast.success("Chambre supprimée avec succès");
		},
		onError: (error) => {
			toast.error("Suppression impossible", {
				description: getErrorMessage(error),
			});
		},
	});
}
