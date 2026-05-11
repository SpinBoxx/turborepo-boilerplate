import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import { z } from "zod";
import EmailVerifiedCard from "@/auth/components/EmailVerifiedCard";

export const Route = createFileRoute("/_auth/email-verified/")({
	validateSearch: z.object({
		redirectTo: z.string().optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const content = useIntlayer("email-verified-card");
	const { redirectTo } = Route.useSearch();
	useDocumentTitle(content.pageTitle.value);

	return <EmailVerifiedCard redirectTo={redirectTo} />;
}
