import type { ManagedUser } from "@zanadeal/api/features/user";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@zanadeal/ui";
import { useEffect } from "react";
import { useAppForm } from "@/hooks/useAppForm";
import { useCreateManagedUser, useUpdateManagedUser } from "../users.queries";

type UserFormValues = {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	isAdmin: boolean;
};

function getInitialValues(user: ManagedUser | null): UserFormValues {
	return {
		email: user?.email ?? "",
		firstName: user?.firstName ?? "",
		lastName: user?.lastName ?? "",
		password: "",
		isAdmin: user?.roles.includes("ADMIN") ?? false,
	};
}

export default function UserUpsertDialog({
	open,
	onOpenChange,
	user,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: ManagedUser | null;
}) {
	const createMutation = useCreateManagedUser();
	const updateMutation = useUpdateManagedUser();
	const isEdit = user != null;
	const isPending = createMutation.isPending || updateMutation.isPending;

	const form = useAppForm({
		defaultValues: getInitialValues(user),
		onSubmit: async ({ value }) => {
			const role = value.isAdmin ? "ADMIN" : "HOTEL_REVIEWER";

			if (isEdit && user) {
				await updateMutation.mutateAsync({
					id: user.id,
					email: value.email,
					firstName: value.firstName,
					lastName: value.lastName,
					role,
				});
			} else {
				await createMutation.mutateAsync({
					email: value.email,
					firstName: value.firstName,
					lastName: value.lastName,
					password: value.password,
					role,
				});
			}

			onOpenChange(false);
		},
	});

	useEffect(() => {
		if (!open) {
			createMutation.reset();
			updateMutation.reset();
		}
	}, [open, createMutation, updateMutation]);

	useEffect(() => {
		if (!open) return;
		form.reset(getInitialValues(user));
	}, [open, user, form]);

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (isPending) return;
				onOpenChange(next);
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
					</DialogTitle>
					<DialogDescription>
						Gérez les comptes admin et hotel reviewer.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
					className="mt-4 grid gap-4"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<form.AppField
							name="firstName"
							validators={{
								onBlur: ({ value }) =>
									value.trim().length > 0 ? undefined : "Prénom requis",
							}}
						>
							{(field) => <field.TextField label="Prénom" />}
						</form.AppField>
						<form.AppField
							name="lastName"
							validators={{
								onBlur: ({ value }) =>
									value.trim().length > 0 ? undefined : "Nom requis",
							}}
						>
							{(field) => <field.TextField label="Nom" />}
						</form.AppField>
					</div>

					<form.AppField
						name="email"
						validators={{
							onBlur: ({ value }) =>
								/^\S+@\S+\.\S+$/.test(value) ? undefined : "Email invalide",
						}}
					>
						{(field) => (
							<field.TextField
								label="Email"
								inputProps={{ type: "email", autoComplete: "email" }}
							/>
						)}
					</form.AppField>

					{!isEdit ? (
						<form.AppField
							name="password"
							validators={{
								onBlur: ({ value }) =>
									value.length >= 8 ? undefined : "8 caractères minimum",
							}}
						>
							{(field) => (
								<field.PasswordField
									label="Mot de passe"
									inputProps={{ autoComplete: "new-password" }}
								/>
							)}
						</form.AppField>
					) : null}

					<form.AppField name="isAdmin">
						{(field) => (
							<field.SwitchContainer
								label="staff-role"
								title="Compte admin"
								description="Désactivé, le compte sera hotel reviewer. Le rôle USER est conservé automatiquement."
							/>
						)}
					</form.AppField>

					<DialogFooter className="pt-2">
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							Annuler
						</Button>
						<form.AppForm>
							<form.SubmitButton>
								{isEdit ? "Enregistrer" : "Créer"}
							</form.SubmitButton>
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
