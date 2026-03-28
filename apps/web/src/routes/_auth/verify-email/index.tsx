import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import { z } from "zod";
import VerifyEmailDialog from "@/auth/components/VerifyEmailDialog";

const verifyEmailSearchSchema = z.object({
	email: z.string().email(),
});

export const Route = createFileRoute("/_auth/verify-email/")({
	component: RouteComponent,
	validateSearch: verifyEmailSearchSchema,
});

function RouteComponent() {
	const { email } = Route.useSearch();
	const content = useIntlayer("verify-email-dialog");
	useDocumentTitle(content.pageTitle.value);

	return <VerifyEmailDialog email={email} />;
}