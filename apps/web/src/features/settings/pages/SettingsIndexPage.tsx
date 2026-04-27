import { useIntlayer } from "react-intlayer";
import SettingsBackButton from "../components/SettingsBackButton";
import SettingsNavigation from "../components/SettingsNavigation";
import SettingsPersonalInformationPage from "./SettingsPersonalInformationPage";

export default function SettingsIndexPage() {
	const t = useIntlayer("settings");

	return (
		<>
			<div className="md:hidden">
				<div className="mb-6 flex items-center justify-between">
					<SettingsBackButton />
				</div>
				<h1 className="mb-6 font-semibold text-2xl text-foreground tracking-normal">
					{t.accountSettings.value}
				</h1>
				<SettingsNavigation />
			</div>

			<div className="hidden md:block">
				<SettingsPersonalInformationPage />
			</div>
		</>
	);
}