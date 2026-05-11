import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import AuthDialog from "@/auth/components/AuthDialog";
import { Route as LoginRoute } from "./route";

export const Route = createFileRoute("/_auth/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	const t = useIntlayer("common");
	const { redirectTo } = LoginRoute.useSearch();
	useDocumentTitle(t.login.value);
	return (
		<div>
			<AuthDialog redirectTo={redirectTo} open />
		</div>
	);
}
