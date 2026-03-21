import type { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
	return <div className="mx-auto max-w-7xl px-5.5 sm:px-8">{children}</div>;
}
