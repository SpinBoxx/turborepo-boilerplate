import type { PropsWithChildren } from "react";
import LoginNavbar from "@/components/navbar/LoginNavbar";
export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="">
			<LoginNavbar />
			{children}
		</div>
	);
}
