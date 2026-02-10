import type { RoomComputed } from "@zanadeal/api/features/room/room.schemas";
import { createContext, useContext } from "react";

type RoomContextValue = {
	room: RoomComputed;
};

export const RoomContext = createContext<RoomContextValue>(
	{} as RoomContextValue,
);

export function RoomProvider({
	room,
	children,
}: {
	room: RoomComputed;
	children: React.ReactNode;
}) {
	const context = { room };

	return (
		<RoomContext.Provider value={context}>{children}</RoomContext.Provider>
	);
}

export function useRoomContext() {
	const ctx = useContext(RoomContext);
	if (!ctx) {
		throw new Error("useRoomContext must be used within <RoomProvider>");
	}
	return ctx;
}
