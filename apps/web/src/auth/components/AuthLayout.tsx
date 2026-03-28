import type { PropsWithChildren } from "react";
import LoginNavbar from "@/widgets/navbar/LoginNavbar";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="pt-4">
			<LoginNavbar />
			{children}
		</div>
	);
}
