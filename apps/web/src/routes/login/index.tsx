import { createFileRoute } from "@tanstack/react-router";
import { useDocumentTitle } from "usehooks-ts";
import AuthDialog from "@/auth/components/AuthDialog";

export const Route = createFileRoute("/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	useDocumentTitle("Login");
	return (
		<div>
			<AuthDialog />
		</div>
	);
}
