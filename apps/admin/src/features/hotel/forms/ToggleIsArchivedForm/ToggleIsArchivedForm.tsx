import { type ButtonVariants, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/useAppForm";
import { useUpdateHotel } from "../../hotel.queries";

interface Props extends ComponentProps<"div"> {
	hotelId: string;
	isArchived: boolean;
	buttonProps?: ComponentProps<"button"> & ButtonVariants;
}

export default function ToggleIsArchivedForm({
	isArchived,
	buttonProps,
	hotelId,
	className,
}: Props) {
	const updateHotel = useUpdateHotel(hotelId);

	const form = useAppForm({
		defaultValues: {
			isArchived: isArchived,
		},
		onSubmit: async ({ value }) => {
			const update = updateHotel.mutateAsync({
				isArchived: !value.isArchived,
			});

			toast.promise(update, {
				loading: isArchived
					? "Désarchivage de l'hôtel..."
					: "Archivage de l'hôtel...",
				success: isArchived
					? "Hôtel désarchivé avec succès"
					: "Hôtel archivé avec succès",
				error: isArchived
					? "Échec du désarchivage de l'hôtel"
					: "Échec de l'archivage de l'hôtel",
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
						{isArchived ? "Désarchiver" : "Archiver"}
					</form.SubmitButton>
				</form.AppForm>
			</form>
		</div>
	);
}
