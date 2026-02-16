import type { DeleteTermsInput } from "@zanadeal/api/contracts";
import { cn } from "@zanadeal/ui";
import { Trash } from "lucide-react";
import type { ComponentProps } from "react";
import { useAppForm } from "@/hooks/useAppForm";
import { useDeleteTerm } from "../terms.queries";

interface Props extends ComponentProps<"form"> {
	id: string;
}

const DeleteTermButton = ({ id, className }: Props) => {
	const deleteTerm = useDeleteTerm();

	const form = useAppForm({
		defaultValues: {
			id,
		} as DeleteTermsInput,
		onSubmit: async () => {
			await deleteTerm.mutateAsync({
				id,
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className={cn("", className)}
		>
			<form.AppForm>
				<form.SubmitButton variants={{ variant: "destructive" }}>
					<Trash />
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
};

export default DeleteTermButton;
