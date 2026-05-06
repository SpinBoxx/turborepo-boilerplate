import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { sanitizeRedirectTo } from "@/auth/services/auth-dialog.service";
import { useAppForm } from "@/hooks/useAppForm";
import { useAuth } from "../providers/AuthProvider";

type ResetPasswordFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
	token: string;
	redirectTo?: string;
};

export default function ResetPasswordForm({
	className,
	token,
	redirectTo = "/",
	...props
}: ResetPasswordFormProps) {
	const content = useIntlayer("reset-password-form");
	const { resetPassword } = useAuth();
	const navigate = useNavigate();
	const safeRedirectTo = sanitizeRedirectTo(redirectTo) ?? "/";
	const form = useAppForm({
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			if (value.newPassword !== value.confirmPassword) return;

			const reset = await resetPassword({
				newPassword: value.newPassword,
				token,
			});

			if (reset) {
				navigate({
					to: "/password-reset-success",
					search: {
						redirectTo: safeRedirectTo,
					},
				});
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
			className={cn(
				"fade-in slide-in-from-bottom-4 animate-in duration-700",
				className,
			)}
			{...props}
		>
			<form.AppField
				name="newPassword"
				validators={{
					onDynamic: ({ value }) => {
						if (!value || value.trim().length === 0) {
							return content.passwordIsRequired.value;
						}
						if (value.length < 8) {
							return content.passwordIsTooShort.value;
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<field.PasswordField
						label={content.newPassword.value}
						inputProps={{ placeholder: "••••••••" }}
					/>
				)}
			</form.AppField>

			<form.AppField
				name="confirmPassword"
				validators={{
					onDynamic: ({ value }) => {
						if (!value || value.trim().length === 0) {
							return content.passwordIsRequired.value;
						}
						if (value !== form.state.values.newPassword) {
							return content.passwordsDoNotMatch.value;
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<field.PasswordField
						label={content.confirmPassword.value}
						inputProps={{ placeholder: "••••••••" }}
					/>
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton variants={{ variant: "default" }}>
					{content.submit.value}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}
