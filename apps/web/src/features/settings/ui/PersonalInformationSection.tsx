import type { CurrentUserProfile } from "@zanadeal/api/features/user";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { useAuth } from "@/auth/providers/AuthProvider";
import PersonalInformationForm from "../forms/PersonalInformationForm/PersonalInformationForm";
import { useUpdateCurrentUserProfile } from "../settings.queries";
import { formatOfficialName } from "../utils/settings-format";
import SettingsFieldRow from "../components/SettingsFieldRow";

interface PersonalInformationSectionProps {
	profile: CurrentUserProfile;
}

export default function PersonalInformationSection({
	profile,
}: PersonalInformationSectionProps) {
	const t = useIntlayer("settings");
	const [isEditing, setIsEditing] = useState(false);
	const updateProfile = useUpdateCurrentUserProfile();
	const { refresh } = useAuth();

	return (
		<section aria-labelledby="personal-information-title">
			<h1
				className="mb-5 font-semibold text-2xl text-foreground tracking-normal md:mb-6"
				id="personal-information-title"
			>
				{t.personalInformation.value}
			</h1>

			<SettingsFieldRow
				actionLabel={isEditing ? t.cancel.value : t.edit.value}
				description={
					isEditing
						? t.nameHelper.value
						: formatOfficialName(profile.firstName, profile.lastName)
				}
				onAction={() => setIsEditing((current) => !current)}
				title={t.information.value}
			>
				{isEditing ? (
					<PersonalInformationForm
						defaultValues={{
							email: profile.email,
							firstName: profile.firstName,
							lastName: profile.lastName,
						}}
						onCancel={() => setIsEditing(false)}
						onSubmit={async (values) => {
							try {
								await updateProfile.mutateAsync(values);
								await refresh();
								toast.success(t.profileUpdated.value);
								setIsEditing(false);
							} catch {
								toast.error(t.profileUpdateFailed.value);
							}
						}}
					/>
				) : null}
			</SettingsFieldRow>

		</section>
	);
}