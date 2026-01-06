import type { Amenity } from "@zanadeal/api/contracts";
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
import { useCreateAmenity, useUpdateAmenity } from "../amenity.queries";

export default function AmenityUpsertDialog({
	open,
	onOpenChange,
	amenity,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	amenity: Amenity | null;
}) {
	const createMutation = useCreateAmenity();
	const updateMutation = useUpdateAmenity();
	const isEdit = amenity != null;
	const isPending = createMutation.isPending || updateMutation.isPending;

	const form = useAppForm({
		defaultValues: {
			name: amenity?.name ?? "",
			icon: amenity?.icon ?? "",
		},
		onSubmit: async ({ value }) => {
			if (isEdit && amenity) {
				await updateMutation.mutateAsync({
					id: amenity.id,
					name: value.name,
					icon: value.icon,
				});
			} else {
				await createMutation.mutateAsync({
					name: value.name,
					icon: value.icon,
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
		form.reset({
			name: amenity?.name ?? "",
			icon: amenity?.icon ?? "",
		});
	}, [open, amenity, form]);

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
						{isEdit ? "Modifier le service" : "Nouveau service"}
					</DialogTitle>
					<DialogDescription>
						Renseignez le nom et l'icône du service.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="grid gap-4"
				>
					<form.AppField
						name="name"
						validators={{
							onBlur: ({ value }) => {
								if (!value || value.trim().length === 0) {
									return "Nom requis";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<field.TextField
								label="Nom"
								inputProps={{ placeholder: "WiFi gratuit" }}
							/>
						)}
					</form.AppField>

					<form.AppField
						name="icon"
						validators={{
							onBlur: ({ value }) => {
								if (!value || value.trim().length === 0) {
									return "Icône requise";
								}
								return undefined;
							},
						}}
					>
						{(field) => <field.TextArea label="Icône" placeholder="svg" />}
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
							<form.SubscribeButton
								label={isEdit ? "Enregistrer" : "Créer"}
								loadingLabel={isEdit ? "Enregistrement" : "Création"}
							/>
						</form.AppForm>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
