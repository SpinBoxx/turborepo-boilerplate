"use client";

import { cn } from "@zanadeal/ui";
import type * as React from "react";
import {
	FormStepperNextButton,
	type FormStepperNextButtonProps,
} from "./FormStepperNextButton";
import {
	FormStepperPrevButton,
	type FormStepperPrevButtonProps,
} from "./FormStepperPrevButton";
import { useStepper } from "./FormStepperProvider";
import {
	FormStepperSubmitButton,
	type FormStepperSubmitButtonProps,
} from "./FormStepperSubmitButton";

interface FormStepperFooterProps extends React.ComponentProps<"div"> {
	prevButtonProps?: FormStepperPrevButtonProps;
	nextButtonProps?: FormStepperNextButtonProps;
	submitButtonProps?: FormStepperSubmitButtonProps;
	showPrevButton?: boolean;
	showNextButton?: boolean;
	showSubmitButton?: boolean;
}

function FormStepperFooter({
	className,
	prevButtonProps,
	nextButtonProps,
	submitButtonProps,
	showPrevButton = true,
	showNextButton = true,
	showSubmitButton = true,
	...props
}: FormStepperFooterProps) {
	const { activeStep, stepsCount } = useStepper();

	const isFirstStep = activeStep <= 1;
	const isLastStep = activeStep >= stepsCount;

	return (
		<div
			className={cn("flex items-center justify-between gap-4 pt-4", className)}
			{...props}
		>
			<div>
				{showPrevButton && !isFirstStep && (
					<FormStepperPrevButton {...prevButtonProps} />
				)}
			</div>
			<div className="flex items-center gap-2">
				{showNextButton && !isLastStep && (
					<FormStepperNextButton {...nextButtonProps} />
				)}
				{showSubmitButton && isLastStep && (
					<FormStepperSubmitButton {...submitButtonProps} />
				)}
			</div>
		</div>
	);
}

export { FormStepperFooter };
export type { FormStepperFooterProps };
