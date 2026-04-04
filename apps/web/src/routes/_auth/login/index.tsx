import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import AuthDialog from "@/auth/components/AuthDialog";

export const Route = createFileRoute("/_auth/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	const t = useIntlayer("common");
	useDocumentTitle(t.login.value);
	return (
		<div>
			<AuthDialog />
		</div>
	);
}