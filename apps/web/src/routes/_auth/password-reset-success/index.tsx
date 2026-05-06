import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import { z } from "zod";
import PasswordResetSuccessPage from "@/pages/password-reset/PasswordResetSuccessPage";

const passwordResetSuccessSearchSchema = z.object({
	redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/_auth/password-reset-success/")({
	component: RouteComponent,
	validateSearch: passwordResetSuccessSearchSchema,
});

function RouteComponent() {
	const content = useIntlayer("password-reset-cards");
	const { redirectTo } = Route.useSearch();
	useDocumentTitle(content.successTitle.value);

	return <PasswordResetSuccessPage redirectTo={redirectTo} />;
}
