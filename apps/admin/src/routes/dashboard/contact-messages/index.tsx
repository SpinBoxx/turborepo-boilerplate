import { createFileRoute } from "@tanstack/react-router";
import ContactMessagesPage from "@/features/contact-messages/ContactMessagesPage";

export const Route = createFileRoute("/dashboard/contact-messages/")({
	component: ContactMessagesPage,
});
