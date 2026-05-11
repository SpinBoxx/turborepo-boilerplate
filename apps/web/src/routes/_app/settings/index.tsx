import { createFileRoute } from "@tanstack/react-router";
import SettingsIndexPage from "@/features/settings/pages/SettingsIndexPage";

export const Route = createFileRoute("/_app/settings/")({
	component: SettingsIndexPage,
});