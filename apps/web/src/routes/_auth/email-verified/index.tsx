import { createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useDocumentTitle } from "usehooks-ts";
import EmailVerifiedCard from "@/auth/components/EmailVerifiedCard";

export const Route = createFileRoute("/_auth/email-verified/")({
	component: RouteComponent,
});

function RouteComponent() {
	const content = useIntlayer("email-verified-card");
	useDocumentTitle(content.pageTitle.value);

	return <EmailVerifiedCard />;
}