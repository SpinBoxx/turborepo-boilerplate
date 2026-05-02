import type { PropsWithChildren } from "react";
import LoginNavbar from "@/widgets/navbar/LoginNavbar";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-dvh flex-col pt-4">
			<LoginNavbar />
			<main className="flex flex-1 flex-col">{children}</main>
		</div>
	);
}
