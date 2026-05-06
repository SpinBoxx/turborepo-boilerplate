import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import { z } from "zod";
import ForgotPasswordPage from "@/pages/password-reset/ForgotPasswordPage";

const forgotPasswordSearchSchema = z.object({
	redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/_auth/forgot-password/")({
	component: RouteComponent,
	validateSearch: forgotPasswordSearchSchema,
});

function RouteComponent() {
	const content = useIntlayer("password-reset-pages");
	const { redirectTo } = Route.useSearch();
	useDocumentTitle(content.forgotPasswordTitle.value);

	return <ForgotPasswordPage redirectTo={redirectTo} />;
}
