"use client";

import { Button, type buttonVariants } from "@zanadeal/ui";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type * as React from "react";
import { useStepper } from "./FormStepperProvider";

interface FormStepperSubmitButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isSubmitting?: boolean;
	loadingText?: string;
}

function FormStepperSubmitButton({
	children,
	disabled,
	isSubmitting = false,
	loadingText = "Envoi en cours...",
	...props
}: FormStepperSubmitButtonProps) {
	const { activeStep, stepsCount } = useStepper();

	const isLastStep = activeStep >= stepsCount;

	// Ne rendre le bouton visible que sur la dernière étape
	if (!isLastStep) {
		return null;
	}

	return (
		<Button type="submit" disabled={disabled || isSubmitting} {...props}>
			{isSubmitting ? (
				<>
					<Loader2 className="size-4 animate-spin" />
					{loadingText}
				</>
			) : (
				(children ?? "Envoyer")
			)}
		</Button>
	);
}

export { FormStepperSubmitButton };
export type { FormStepperSubmitButtonProps };
