import { useNavigate } from "@tanstack/react-router";
import type { UpsertUserInput } from "@zanadeal/api/features/user";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import {
	buildEmailVerifiedCallbackUrl,
	sanitizeRedirectTo,
} from "@/auth/services/auth-dialog.service";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import { useAuth } from "../providers/AuthProvider";

type RegisterFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
	redirectTo?: string;
	onAlreadyHaveAccountClick: () => void;
};

export default function RegisterForm({
	className,
	redirectTo = "/",
	onAlreadyHaveAccountClick,
	...props
}: RegisterFormProps) {
	const content = useIntlayer("register-form");
	const { signUpWithEmail } = useAuth();
	const navigate = useNavigate();
	const safeRedirectTo = sanitizeRedirectTo(redirectTo);
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		} satisfies UpsertUserInput,
		onSubmit: async ({ value }) => {
			const user = await signUpWithEmail(
				{
					...value,
					callbackURL: buildEmailVerifiedCallbackUrl(
						window.location.origin,
						safeRedirectTo,
					),
				},
				{},
			);

			if (user) {
				navigate({
					to: "/verify-email",
					search: {
						email: value.email,
						redirectTo: safeRedirectTo,
					},
				});
			}
		},
	});

	return (
		<div className="fade-in slide-in-from-bottom-4 animate-in duration-700">
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
				className={cn("", className)}
				{...props}
			>
				<form.AppField
					name="email"
					validators={{
						onBlur: ({ value }) => {
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

				<form.AppField
					name="password"
					validators={{
						onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) {
								return content.passwordIsRequired.value;
							}

							return undefined;
						},
					}}
				>
					{(field) => (
						<field.PasswordField
							label={content.password.value}
							inputProps={{ placeholder: "••••••••" }}
						/>
					)}
				</form.AppField>

				<form.AppField
					name="firstName"
					validators={{
						onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) {
								return content.firstNameIsRequired.value;
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.TextField
							label={content.firstName.value}
							inputProps={{ type: "text" }}
						/>
					)}
				</form.AppField>
				<form.AppField
					name="lastName"
					validators={{
						onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) {
								return content.lastNameIsRequired.value;
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.TextField
							label={content.lastName.value}
							inputProps={{ type: "text" }}
						/>
					)}
				</form.AppField>
				<form.AppForm>
					<form.SubmitButton variants={{ variant: "default" }}>
						{content.register.value}
					</form.SubmitButton>
				</form.AppForm>
			</form>
			<div className="mt-4 text-center">
				<Button
					onClick={onAlreadyHaveAccountClick}
					variant={"link"}
					className="text-muted-foreground text-sm"
				>
					{content.alreadyHaveAnAccountSign}
				</Button>
			</div>
		</div>
	);
}
