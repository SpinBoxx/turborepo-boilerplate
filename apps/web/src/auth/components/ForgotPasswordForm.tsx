import { revalidateLogic } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import {
	buildPasswordResetCallbackUrl,
	sanitizeRedirectTo,
} from "@/auth/services/auth-dialog.service";
import { useAppForm } from "@/hooks/useAppForm";
import { useAuth } from "../providers/AuthProvider";

type ForgotPasswordFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
	redirectTo?: string;
};

export default function ForgotPasswordForm({
	className,
	redirectTo = "/",
	...props
}: ForgotPasswordFormProps) {
	const content = useIntlayer("forgot-password-form");
	const { requestPasswordReset } = useAuth();
	const navigate = useNavigate();
	const safeRedirectTo = sanitizeRedirectTo(redirectTo) ?? "/";
	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			const sent = await requestPasswordReset({
				email: value.email,
				redirectTo: buildPasswordResetCallbackUrl(
					window.location.origin,
					safeRedirectTo,
				),
			});

			if (sent) {
				navigate({
					to: "/forgot-password-sent",
					search: {
						email: value.email,
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
				name="email"
				validators={{
					onDynamic: ({ value }) => {
						if (!value || value.trim().length === 0) {
							return content.emailIsRequired.value;
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<field.TextField
						label={content.email.value}
						inputProps={{ type: "email", placeholder: "john@example.com" }}
					/>
				)}
			</form.AppField>

			<form.AppForm>
				<form.SubmitButton variants={{ variant: "default" }}>
					{content.submit.value}
				</form.SubmitButton>
			</form.AppForm>

			<Link
				to="/login"
				search={{
					redirectTo: safeRedirectTo,
				}}
				className="text-center text-muted-foreground text-sm"
			>
				{content.backToLogin.value}
			</Link>
		</form>
	);
}
