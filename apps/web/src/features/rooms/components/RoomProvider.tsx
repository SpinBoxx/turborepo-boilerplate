import type { RoomUserComputed } from "@zanadeal/api/features/room";

import { createContext, type ReactNode, useContext } from "react";

export type RoomContext = {
	room: RoomUserComputed;
};

export const RoomProviderContext = createContext<RoomContext>(
	{} as RoomContext,
);

export const useRoomContext = () => useContext(RoomProviderContext);

export default function RoomProvider({
	room,
	children,
}: {
	children: ReactNode | ((context: RoomContext) => ReactNode);
	room: RoomUserComputed;
}) {
	const contextValue = {
		room,
	};

	return (
		<RoomProviderContext.Provider value={contextValue}>
			{typeof children === "function" ? children(contextValue) : children}
		</RoomProviderContext.Provider>
	);
}
