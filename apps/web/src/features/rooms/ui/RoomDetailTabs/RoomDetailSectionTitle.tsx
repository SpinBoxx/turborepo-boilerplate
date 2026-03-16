import type { PropsWithChildren } from "react";

export default function RoomDetailSectionTitle({
	children,
}: PropsWithChildren) {
	return <p className="font-semibold text-lg sm:text-xl">{children}</p>;
}
