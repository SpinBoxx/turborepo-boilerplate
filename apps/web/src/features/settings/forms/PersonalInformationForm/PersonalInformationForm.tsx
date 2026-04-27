import type { UpdateCurrentUserProfileInput } from "@zanadeal/api/features/user";
import { useId } from "react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePersonalInformationForm } from "./usePersonalInformationForm";

interface PersonalInformationFormProps {
	defaultValues: UpdateCurrentUserProfileInput;
	onCancel: () => void;
	onSubmit: (values: UpdateCurrentUserProfileInput) => Promise<void>;
}

export default function PersonalInformationForm({
	defaultValues,
	onCancel,
	onSubmit,
}: PersonalInformationFormProps) {
	const t = useIntlayer("settings");
	const formT = useIntlayer("personal-information-form");
	const firstNameId = useId();
	const lastNameId = useId();
	const emailId = useId();
	const errorId = useId();
	const form = usePersonalInformationForm({ defaultValues, onSubmit });
	const errorMessage =
		form.error === "email" ? t.invalidEmail.value : t.requiredField.value;

	return (
		<form
			className="space-y-4"
			onSubmit={(event) => {
				event.preventDefault();
				form.submit();
			}}
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<label className="block" htmlFor={firstNameId}>
					<span className="sr-only">{t.firstNameOnId.value}</span>
					<Input
						aria-describedby={form.error ? errorId : undefined}
						aria-invalid={!!form.error}
						id={firstNameId}
						nativeInput
						onChange={(event) => {
							form.setValues((current) => ({
								...current,
								firstName: event.target.value,
							}));
						}}
						placeholder={t.firstNameOnId.value}
						size="lg"
						value={form.values.firstName}
					/>
				</label>
				<label className="block" htmlFor={lastNameId}>
					<span className="sr-only">{t.lastNameOnId.value}</span>
					<Input
						aria-describedby={form.error ? errorId : undefined}
						aria-invalid={!!form.error}
						id={lastNameId}
						nativeInput
						onChange={(event) => {
							form.setValues((current) => ({
								...current,
								lastName: event.target.value,
							}));
						}}
						placeholder={t.lastNameOnId.value}
						size="lg"
						value={form.values.lastName}
					/>
				</label>
			</div>

			<label className="block max-w-sm" htmlFor={emailId}>
				<span className="mb-2 block font-semibold text-sm">{t.emailLabel.value}</span>
				<Input
					aria-describedby={form.error ? errorId : undefined}
					aria-invalid={!!form.error}
					id={emailId}
					nativeInput
					onChange={(event) => {
						form.setValues((current) => ({
							...current,
							email: event.target.value,
						}));
					}}
					size="lg"
					type="email"
					value={form.values.email}
				/>
			</label>

			{form.error ? (
				<p className="text-destructive text-sm" id={errorId} role="alert">
					{errorMessage}
				</p>
			) : null}

			<div className="flex items-center gap-4">
				<Button
					className="h-12 rounded-xl px-6 text-base"
					disabled={form.isSubmitting || !form.isDirty}
					type="submit"
				>
					{form.isSubmitting ? formT.saving.value : t.save.value}
				</Button>
				<button
					className="font-semibold text-sm underline underline-offset-2 hover:text-foreground/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={onCancel}
					type="button"
				>
					{t.cancel.value}
				</button>
			</div>
		</form>
	);
}