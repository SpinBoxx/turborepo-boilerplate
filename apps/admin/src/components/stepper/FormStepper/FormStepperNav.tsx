import type { ComponentProps } from "react";
import {
	type FormStepperStep,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperTitle,
	StepperTrigger,
} from "./FormStepperProvider";

interface Props extends ComponentProps<"div"> {
	steps: FormStepperStep[];
}

export default function FormStepperNav({ steps }: Props) {
	return (
		<StepperNav className="mb-4 gap-3.5">
			{steps.map((step, index) => {
				return (
					<StepperItem
						key={index}
						step={index + 1}
						className="relative flex-1 items-start"
					>
						<StepperTrigger
							type="button"
							className="flex grow flex-col items-start justify-center gap-3.5"
						>
							<div className="flex flex-col items-start gap-1">
								<StepperTitle className="text-start font-semibold group-data-[state=inactive]/step:text-muted-foreground">
									{step.title}
								</StepperTitle>
							</div>
							<StepperIndicator className="h-1 w-full rounded-full bg-border data-[state=active]:bg-primary" />
						</StepperTrigger>
					</StepperItem>
				);
			})}
		</StepperNav>
	);
}
