"use client";

import { Button, type buttonVariants } from "@zanadeal/ui";
import type { VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import type * as React from "react";
import { useStepper } from "./FormStepperProvider";

interface FormStepperNextButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

function FormStepperNextButton({
	children,
	disabled,
	onClick,
	...props
}: FormStepperNextButtonProps) {
	const { activeStep, setActiveStep, stepsCount } = useStepper();

	const isLastStep = activeStep >= stepsCount;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!isLastStep) {
			setActiveStep(activeStep + 1);
		}
		onClick?.(e);
	};

	return (
		<Button
			type="button"
			disabled={disabled || isLastStep}
			onClick={handleClick}
			{...props}
		>
			{children ?? (
				<>
					Suivant
					<ChevronRight className="size-4" />
				</>
			)}
		</Button>
	);
}

export { FormStepperNextButton };
export type { FormStepperNextButtonProps };
