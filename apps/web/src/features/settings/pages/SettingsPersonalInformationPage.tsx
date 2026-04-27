import { useIntlayer } from "react-intlayer";
import SettingsBackButton from "../components/SettingsBackButton";
import { useCurrentUserProfile } from "../settings.queries";
import PersonalInformationSection from "../ui/PersonalInformationSection";
import SettingsPageSkeleton from "../ui/SettingsPageSkeleton";

export default function SettingsPersonalInformationPage() {
	const t = useIntlayer("settings");
	const profileQuery = useCurrentUserProfile();

	if (profileQuery.isLoading && !profileQuery.data) {
		return <SettingsPageSkeleton />;
	}

	if (profileQuery.isError || !profileQuery.data) {
		return (
			<div className="py-4">
				<p className="text-destructive text-sm">
					{t.profileUpdateFailed.value}
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-6 flex items-center justify-between md:hidden">
				<SettingsBackButton />
			</div>
			<PersonalInformationSection profile={profileQuery.data} />
		</>
	);
}