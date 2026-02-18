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
							className="flex grow flex-col items-start justify-center gap-2.5"
						>
							<div className="flex w-full flex-col items-start">
								<StepperTitle className="hidden text-start font-semibold group-data-[state=inactive]/step:text-muted-foreground sm:block">
									{step.title}
								</StepperTitle>
								<StepperTitle className="self-center font-semibold group-data-[state=inactive]/step:text-muted-foreground sm:hidden [&_svg]:size-5">
									{step.icon}
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
