import { createFileRoute } from "@tanstack/react-router";
import SettingsPersonalInformationPage from "@/features/settings/pages/SettingsPersonalInformationPage";

export const Route = createFileRoute("/_app/settings/personal-information")({
	component: SettingsPersonalInformationPage,
});