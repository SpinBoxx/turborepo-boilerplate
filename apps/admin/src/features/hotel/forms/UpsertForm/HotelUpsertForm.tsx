import type { Hotel } from "@zanadeal/api/features/hotel/schemas/hotel.schema";
import { cn } from "@zanadeal/ui";
import { fileToBase64, urlToFile } from "@zanadeal/utils";
import { CreditCard, ForkKnife, Image, Info, Save } from "lucide-react";
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
import { useCreateHotel, useUpdateHotel } from "../../hotel.queries";
import HotelAmenitiesStep from "./HotelAmenitiesStep";
import HotelBankAccountStep from "./HotelBankAccountStep";
import HotelImagesStep from "./HotelImagesStep";
import HotelInformationsStep from "./HotelInformationStep";
import { getHotelInitValues } from "./hotelUpsertForm.defaults";

interface Props extends ComponentProps<"div"> {
	hotel: Hotel | null;
}

export default function HotelUpsertForm({ hotel, className }: Props) {
	const [files, setFiles] = useState<File[]>([]);
	const [_isSubmitting, setIsSubmitting] = useState(false);
	const createHotel = useCreateHotel();
	const updateHotel = useUpdateHotel(hotel?.id || "");

	const form = useAppForm({
		defaultValues: getHotelInitValues(hotel || undefined),
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			const imagesBase64 = await Promise.all(files.map(fileToBase64));
			await (hotel ? updateHotel : createHotel)
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
			icon: <Info />,
			title: "Informations",
		},
		{
			content: <HotelBankAccountStep form={form} />,
			title: "Compte bancaire",
			icon: <CreditCard />,
		},
		{
			content: <HotelAmenitiesStep form={form} />,
			title: "Services",
			icon: <ForkKnife />,
		},
		{
			content: (
				<HotelImagesStep form={form} files={files} setFiles={setFiles} />
			),
			icon: <Image />,
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

					<FormStepperFooter>
						<form.AppForm>
							<form.SubmitButton variants={{}}>
								<Save />
								Sauvegarder
							</form.SubmitButton>
						</form.AppForm>
					</FormStepperFooter>
				</Stepper>
			</form>
		</div>
	);
}
