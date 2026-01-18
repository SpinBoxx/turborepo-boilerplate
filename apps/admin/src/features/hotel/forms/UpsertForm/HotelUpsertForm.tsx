import type { Hotel } from "@zanadeal/api/contracts";
import { cn } from "@zanadeal/ui";
import { fileToBase64, urlToFile } from "@zanadeal/utils";
import { type ComponentProps, useEffect, useState } from "react";
import { FormStepperFooter } from "@/components/stepper/FormStepper/FormStepperFooter";
import FormStepperNav from "@/components/stepper/FormStepper/FormStepperNav";
import {
	type FormStepperStep,
	Stepper,
	StepperContent,
	StepperPanel,
} from "@/components/stepper/FormStepper/FormStepperProvider";
import { useAppForm } from "@/hooks/useAppForm";
import { useCreateHotel } from "../../hotel.queries";
import HotelAmenitiesStep from "./HotelAmenitiesStep";
import HotelBankAccountStep from "./HotelBankAccountStep";
import HotelImagesStep from "./HotelImagesStep";
import HotelInformationsStep from "./HotelInformationStep";
import { getHotelUpsertDefaultValues } from "./hotelUpsertForm.defaults";

interface Props extends ComponentProps<"div"> {
	hotel: Hotel | null;
}

export default function HotelUpsertForm({ hotel, className }: Props) {
	const [files, setFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createHotel = useCreateHotel();
	console.log(hotel);

	const form = useAppForm({
		defaultValues: getHotelUpsertDefaultValues(hotel || undefined),
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			const imagesBase64 = await Promise.all(files.map(fileToBase64));

			await createHotel
				.mutateAsync({
					...value,
					images: imagesBase64.map((base64) => ({ base64 })),
				})
				.finally(() => setIsSubmitting(false));
		},
	});

	useEffect(() => {
		if (hotel?.images.length) {
			Promise.all(
				hotel.images.map((image, index) =>
					urlToFile(image.url, `hotel-image-${index}.jpg`, "image/jpeg"),
				),
			).then((files) => {
				setFiles(files);
			});
		}
	}, [hotel?.images]);

	const steps: FormStepperStep[] = [
		{
			content: <HotelInformationsStep form={form} />,
			title: "Informations",
		},
		{ content: <HotelBankAccountStep form={form} />, title: "Compte bancaire" },
		{ content: <HotelAmenitiesStep form={form} />, title: "Services" },
		{
			content: (
				<HotelImagesStep form={form} files={files} setFiles={setFiles} />
			),
			title: "Images",
		},
	];

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
				<Stepper
					defaultValue={1}
					stepsCount={steps.length}
					className="space-y-8"
				>
					<FormStepperNav steps={steps} />

					<StepperPanel className="text-sm">
						{steps.map((step, index) => (
							<StepperContent
								key={index}
								value={index + 1}
								className="flex w-full"
							>
								{step.content}
							</StepperContent>
						))}
					</StepperPanel>
					{form.getFieldValue("images")?.length}
					<FormStepperFooter
						submitButtonProps={{
							isSubmitting,
						}}
					/>
				</Stepper>
			</form>
		</div>
	);
}
