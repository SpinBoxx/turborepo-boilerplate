import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import { z } from "zod";
import ResetPasswordPage from "@/pages/password-reset/ResetPasswordPage";

const resetPasswordSearchSchema = z.object({
	error: z.string().optional(),
	redirectTo: z.string().optional(),
	token: z.string().optional(),
});

export const Route = createFileRoute("/_auth/reset-password/")({
	component: RouteComponent,
	validateSearch: resetPasswordSearchSchema,
});

function RouteComponent() {
	const content = useIntlayer("password-reset-pages");
	const { error, redirectTo, token } = Route.useSearch();
	useDocumentTitle(content.resetPasswordTitle.value);

	return (
		<ResetPasswordPage error={error} redirectTo={redirectTo} token={token} />
	);
}
