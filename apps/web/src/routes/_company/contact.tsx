import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/pages/contact/ContactPage";

export const Route = createFileRoute("/_company/contact")({
	component: ContactPage,
});
