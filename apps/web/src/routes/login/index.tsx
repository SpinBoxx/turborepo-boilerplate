import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "usehooks-ts";
import LoginForm from "@/auth/components/LoginForm";

export const Route = createFileRoute("/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	useDocumentTitle("Login");
	return (
		<div>
			<LoginForm />
		</div>
	);
}
