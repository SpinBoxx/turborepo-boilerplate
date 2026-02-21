import type { TermsComputed } from "@zanadeal/api/features/terms/terms-schemas";
import { cn } from "@zanadeal/ui";
import { PlusCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { TranslationTabsForm } from "@/components/TranslationTabsForm";
import { useAppForm } from "@/hooks/useAppForm";
import { TermsType } from "../../../../../../packages/db/prisma/generated/enums";
import { useCreateTerm } from "../terms.queries";
import { getTermInitialValues } from "./UpsertTermForm.config";

interface Props extends ComponentProps<"form"> {
	term?: TermsComputed;
}

const UpsertTermForm = ({ term, className }: Props) => {
	const createTerm = useCreateTerm();
	console.log(term);

	const form = useAppForm({
		defaultValues: getTermInitialValues(term || null),
		onSubmit: async ({ value }) => {
			await createTerm.mutateAsync({ ...value });
		},
	});
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={cn("flex flex-col gap-4", className)}
		>
			<form.AppField name="type">
				{(field) => (
					<field.Select
						label="Type de condition"
						values={Object.values(TermsType).map((type) => ({
							label: type,
							value: type,
						}))}
					/>
				)}
			</form.AppField>
			<form.AppField name="version">
				{(field) => (
					<div>
						{term && <span>Prev: {term.version}</span>}
						<field.TextField
							label="Version"
							inputProps={{
								placeholder: "v1.0",
							}}
						/>
					</div>
				)}
			</form.AppField>
			<form.AppField name="translations">
				{(field) => (
					<TranslationTabsForm
						inputType="code"
						fieldKey="content"
						value={field.state.value}
						onChange={field.handleChange}
					/>
				)}
			</form.AppField>
			<form.AppForm>
				<form.SubmitButton>
					<PlusCircle className="mr-2" />
					{term ? "Créer une nouvelle version" : "Créer"}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
};

export default UpsertTermForm;
