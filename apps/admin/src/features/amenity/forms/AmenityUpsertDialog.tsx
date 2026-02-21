import type { Amenity } from "@zanadeal/api/features/amenity/amenity.schemas";
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
import { TranslationTabsForm } from "@/components/TranslationTabsForm";
import { useAppForm } from "@/hooks/useAppForm";
import { useCreateAmenity, useUpdateAmenity } from "../amenity.queries";
import { getAmenityInitialValues } from "./init-amenity";

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
	const updateMutation = useUpdateAmenity(amenity?.id ?? "");
	const isEdit = amenity != null;
	const isPending = createMutation.isPending || updateMutation.isPending;

	const form = useAppForm({
		defaultValues: getAmenityInitialValues(amenity),
		onSubmit: async ({ value }) => {
			if (isEdit && amenity) {
				await updateMutation.mutateAsync({
					slug: value.slug,
					translations: value.translations,
					icon: value.icon,
				});
			} else {
				await createMutation.mutateAsync({
					slug: value.slug,
					translations: value.translations,
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
		form.reset(getAmenityInitialValues(amenity));
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
					className="mt-4 grid gap-4"
				>
					<form.AppField
						name="slug"
						validators={{
							onBlur: ({ value }) => {
								if (!value || value.trim().length === 0) {
									return "Slug requis";
								}
								return undefined;
							},
						}}
					>
						{(field) => (
							<field.TextField
								label="Slug"
								inputProps={{
									placeholder: "wifi",
								}}
							/>
						)}
					</form.AppField>

					<form.AppField name="translations">
						{(field) => (
							<TranslationTabsForm
								fieldKey="name"
								value={field.state.value}
								onChange={field.handleChange}
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
						{(field) => (
							<div>
								<field.TextArea label="Icône" placeholder="svg" />
								<small>
									Site d'icône:{" "}
									<a
										href="https://lucide.dev/icons"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 underline"
									>
										https://lucide.dev/icons
									</a>{" "}
									(Inserer le code SVG)
								</small>
							</div>
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
