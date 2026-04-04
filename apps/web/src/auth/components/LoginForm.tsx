import { revalidateLogic } from "@tanstack/react-form";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import { useAuth } from "../providers/AuthProvider";

type LoginFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
	redirectTo?: string;
	onCreateAccountClick: () => void;
};

export default function LoginForm({
	className,
	redirectTo = "/",
	onCreateAccountClick,
	...props
}: LoginFormProps) {
	const content = useIntlayer("login-form");
	const { signInWithEmail } = useAuth();
	const navigate = useNavigate();
	const router = useRouter();
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			await signInWithEmail(value, {
				onSuccess: () => {
					router.invalidate();
					navigate({ to: redirectTo });
				},
			});
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

				<form.AppField
					name="password"
					validators={{
						onDynamic: ({ value }) => {
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

				<div className="text-right">
					<Link to="/">
						<p className="text-muted-foreground text-sm">
							{content.forgotPassword.value}
						</p>
					</Link>
				</div>
				<form.AppForm>
					<form.SubmitButton variants={{ variant: "default" }}>
						{content.login.value}
					</form.SubmitButton>
				</form.AppForm>
			</form>
			<div className="mt-4 text-center">
				<Button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onCreateAccountClick();
					}}
					variant={"link"}
					className="text-muted-foreground text-sm"
				>
					{content.noAccountTextAction.value}
				</Button>
			</div>
		</div>
	);
}
