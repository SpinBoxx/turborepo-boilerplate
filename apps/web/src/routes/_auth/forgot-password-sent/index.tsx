import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import { z } from "zod";
import ForgotPasswordSentPage from "@/pages/password-reset/ForgotPasswordSentPage";

const forgotPasswordSentSearchSchema = z.object({
	email: z.email().optional(),
	redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/_auth/forgot-password-sent/")({
	component: RouteComponent,
	validateSearch: forgotPasswordSentSearchSchema,
});

function RouteComponent() {
	const content = useIntlayer("password-reset-cards");
	const { email, redirectTo } = Route.useSearch();
	useDocumentTitle(content.sentTitle.value);

	return <ForgotPasswordSentPage email={email} redirectTo={redirectTo} />;
}
