import type { PropsWithChildren } from "react";
import Navbar from "@/components/Navbar";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
}
