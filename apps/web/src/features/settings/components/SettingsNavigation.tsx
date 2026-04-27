import { UserRoundIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import SettingsNavigationItem from "./SettingsNavigationItem";

export default function SettingsNavigation() {
	const t = useIntlayer("settings");

	return (
		<nav aria-label={t.accountSettings.value} className="space-y-1">
			<SettingsNavigationItem
				active
				icon={UserRoundIcon}
				label={t.personalInformation.value}
				to="/settings/personal-information"
			/>
		</nav>
	);
}