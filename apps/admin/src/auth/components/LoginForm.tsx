import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";

import { useAppForm } from "@/hooks/useAppForm";
import { useAuth } from "../providers/AuthProvider";

type LoginFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
	redirectTo?: string;
};

export default function LoginForm({
	className,
	redirectTo = "/dashboard",
	...props
}: LoginFormProps) {
	const { signInWithEmail } = useAuth();
	const navigate = useNavigate();
	const router = useRouter();
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
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
			<div className="mb-8">
				<h2 className="mb-2 font-bold text-2xl text-foreground">
					Bon retour 👋
				</h2>
				<p className="text-muted-foreground">
					Entrez vos identifiants pour accéder au dashboard.
				</p>
			</div>
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
								return "Email is required";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.TextField
							label="Email"
							inputProps={{ type: "email", placeholder: "john@example.com" }}
						/>
					)}
				</form.AppField>

				<form.AppField
					name="password"
					validators={{
						onBlur: ({ value }) => {
							if (!value || value.trim().length === 0) {
								return "Password is required";
							}

							return undefined;
						},
					}}
				>
					{(field) => (
						<field.PasswordField
							label="Mot de passe"
							inputProps={{ placeholder: "••••••••" }}
						/>
					)}
				</form.AppField>

				<div className="text-right">
					<Link to="/">
						<p className="text-muted-foreground text-sm">
							Mot de passe oublié ?
						</p>
					</Link>
				</div>
				<form.AppForm>
					<form.SubscribeButton label="Se connecter" />
				</form.AppForm>
			</form>
		</div>
	);
}
