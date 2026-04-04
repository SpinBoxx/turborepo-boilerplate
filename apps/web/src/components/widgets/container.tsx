import type { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
	return (
		<div className="mx-auto max-w-7xl px-2 sm:px-8 xl:px-0">{children}</div>
	);
}
