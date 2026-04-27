import { useMemo, useState } from "react";
import type { UpdateCurrentUserProfileInput } from "@zanadeal/api/features/user";

interface UsePersonalInformationFormOptions {
	defaultValues: UpdateCurrentUserProfileInput;
	onSubmit: (values: UpdateCurrentUserProfileInput) => Promise<void>;
}

export function usePersonalInformationForm({
	defaultValues,
	onSubmit,
}: UsePersonalInformationFormOptions) {
	const [values, setValues] = useState(defaultValues);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isDirty = useMemo(() => {
		return (
			values.firstName !== defaultValues.firstName ||
			values.lastName !== defaultValues.lastName ||
			values.email !== defaultValues.email
		);
	}, [defaultValues, values]);

	async function submit() {
		setError(null);
		if (!values.firstName.trim() || !values.lastName.trim() || !values.email.trim()) {
			setError("required");
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			setError("email");
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit({
				email: values.email.trim(),
				firstName: values.firstName.trim(),
				lastName: values.lastName.trim(),
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return {
		error,
		isDirty,
		isSubmitting,
		setValues,
		submit,
		values,
	};
}