import { revalidateLogic } from "@tanstack/react-form";
import type { CreateContactMessageInput } from "@zanadeal/api/features/contact-message";
import { useMemo } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { useAuth } from "@/auth/providers/AuthProvider";
import { useAppForm } from "@/hooks/useAppForm";
import { useCreateContactMessage } from "../../contact.queries";

export interface ContactFormValues {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useContactForm() {
	const t = useIntlayer("contact-form");
	const { user, status } = useAuth();
	const createContactMessage = useCreateContactMessage();
	const isAuthenticated = status === "authenticated" && Boolean(user);
	const identityName = user
		? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
		: "";

	const defaultValues = useMemo(
		() =>
			({
				name: identityName,
				email: user?.email ?? "",
				subject: "",
				message: "",
				website: "",
			}) satisfies ContactFormValues,
		[identityName, user?.email],
	);

	const form = useAppForm({
		defaultValues,
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			const input: CreateContactMessageInput = isAuthenticated
				? {
						subject: value.subject,
						message: value.message,
						website: value.website,
					}
				: {
						name: value.name,
						email: value.email,
						subject: value.subject,
						message: value.message,
						website: value.website,
					};

			try {
				await createContactMessage.mutateAsync(input);
				toast.success(t.successTitle.value, {
					description: t.successDescription.value,
				});
				form.reset(defaultValues);
			} catch (_error) {
				toast.error(t.errorTitle.value, {
					description: t.errorDescription.value,
				});
			}
		},
	});

	const validators = {
		name: {
			onDynamic: ({ value }: { value: string }) => {
				if (!isAuthenticated && value.trim().length === 0) {
					return t.errors.nameRequired.value;
				}
				return undefined;
			},
		},
		email: {
			onDynamic: ({ value }: { value: string }) => {
				if (isAuthenticated) return undefined;
				if (value.trim().length === 0) {
					return t.errors.emailRequired.value;
				}
				if (!emailPattern.test(value)) {
					return t.errors.emailInvalid.value;
				}
				return undefined;
			},
		},
		subject: {
			onDynamic: ({ value }: { value: string }) => {
				const trimmed = value.trim();
				if (trimmed.length === 0) return t.errors.subjectRequired.value;
				if (trimmed.length > 160) return t.errors.subjectMax.value;
				return undefined;
			},
		},
		message: {
			onDynamic: ({ value }: { value: string }) => {
				const trimmed = value.trim();
				if (trimmed.length === 0) return t.errors.messageRequired.value;
				if (trimmed.length > 4000) return t.errors.messageMax.value;
				return undefined;
			},
		},
	};

	return {
		form,
		validators,
		isAuthenticated,
		identityName,
		identityEmail: user?.email ?? "",
		isSubmitting: createContactMessage.isPending,
	};
}
