import type { Hotel } from "@zanadeal/api/contracts";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { FormStepperFooter } from "@/components/stepper/FormStepper/FormStepperFooter";
import FormStepperNav from "@/components/stepper/FormStepper/FormStepperNav";
import {
	type FormStepperStep,
	Stepper,
	StepperContent,
	StepperPanel,
} from "@/components/stepper/FormStepper/FormStepperProvider";
import { useAppForm } from "@/hooks/useAppForm";
import HotelAmenitiesStep from "./HotelAmenitiesStep";
import HotelBankAccountStep from "./HotelBankAccountStep";
import HotelInformationsStep from "./HotelInformationStep";
import { getHotelUpsertDefaultValues } from "./hotelUpsertForm.defaults";

interface Props extends ComponentProps<"div"> {
	hotel: Hotel | null;
}

export default function HotelUpsertForm({ hotel, className }: Props) {
	const form = useAppForm({
		defaultValues: getHotelUpsertDefaultValues(hotel || undefined),
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	const steps: FormStepperStep[] = [
		{
			content: <HotelInformationsStep form={form} />,
			title: "Informations",
		},
		{ content: <HotelBankAccountStep form={form} />, title: "Compte bancaire" },
		{ content: <HotelAmenitiesStep form={form} />, title: "Services" },
		{ content: <div>Bonjour2</div>, title: "Step 4" },
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
					<FormStepperFooter />
				</Stepper>
			</form>
		</div>
	);
}
