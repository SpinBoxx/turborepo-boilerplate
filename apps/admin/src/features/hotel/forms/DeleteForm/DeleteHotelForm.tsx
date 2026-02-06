import { type ButtonVariants, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/useAppForm";
import { useDeleteHotel } from "../../hotel.queries";

interface Props extends ComponentProps<"div"> {
	hotelId: string;
	buttonProps?: ComponentProps<"button"> & ButtonVariants;
}

export default function DeleteHotelForm({
	buttonProps,
	hotelId,
	className,
}: Props) {
	const deleteHotel = useDeleteHotel();

	const form = useAppForm({
		onSubmit: async () => {
			const deletePromise = deleteHotel.mutateAsync({ id: hotelId });

			toast.promise(deletePromise, {
				loading: "Suppression de l'hôtel...",
				success: "Hôtel supprimé avec succès",
				error: "Échec de la suppression de l'hôtel",
			});
		},
	});

	return (
		<div className={cn(className)}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="grid gap-4"
			>
				<form.AppForm>
					<form.SubmitButton
						variants={{
							variant: buttonProps?.variant,
							size: buttonProps?.size,
						}}
						className={cn("", buttonProps?.className)}
					>
						Supprimer
					</form.SubmitButton>
				</form.AppForm>
			</form>
		</div>
	);
}
