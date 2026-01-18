"use client";

import { Button, type buttonVariants } from "@zanadeal/ui";
import type { VariantProps } from "class-variance-authority";
import { ChevronLeft } from "lucide-react";
import type * as React from "react";
import { useStepper } from "./FormStepperProvider";

interface FormStepperPrevButtonProps
	extends React.ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

function FormStepperPrevButton({
	children,
	disabled,
	onClick,
	...props
}: FormStepperPrevButtonProps) {
	const { activeStep, setActiveStep } = useStepper();

	const isFirstStep = activeStep <= 1;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!isFirstStep) {
			setActiveStep(activeStep - 1);
		}
		onClick?.(e);
	};

	return (
		<Button
			type="button"
			variant="outline"
			disabled={disabled || isFirstStep}
			onClick={handleClick}
			{...props}
		>
			{children ?? (
				<>
					<ChevronLeft className="size-4" />
					Précédent
				</>
			)}
		</Button>
	);
}

export { FormStepperPrevButton };
export type { FormStepperPrevButtonProps };
