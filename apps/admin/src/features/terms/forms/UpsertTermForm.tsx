import type { Terms } from "@zanadeal/api/contracts";
import { cn } from "@zanadeal/ui";
import { PlusCircle } from "lucide-react";
import type { ComponentProps } from "react";
import Editor from "@/components/editor/Editor";
import { useAppForm } from "@/hooks/useAppForm";
import { TermsType } from "../../../../../../packages/db/prisma/generated/enums";
import { useCreateTerm } from "../terms.queries";
import { getInitialTerm } from "./UpsertTermForm.config";

interface Props extends ComponentProps<"form"> {
	term?: Terms;
}

const UpsertTermForm = ({ term, className }: Props) => {
	const createTerm = useCreateTerm();
	console.log(term);

	const form = useAppForm({
		defaultValues: getInitialTerm(term || undefined),
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
			<form.AppField name="content">
				{(field) => (
					<Editor
						value={field.state.value}
						language="html"
						className="overflow-x-auto"
						setValue={field.handleChange}
					/>
				)}
			</form.AppField>
			<form.AppForm>
				<form.SubscribeButton
					icon={<PlusCircle className="size-5" />}
					label={cn(term ? "Créer une nouvelle version" : "Créer")}
				/>
			</form.AppForm>
		</form>
	);
};

export default UpsertTermForm;
