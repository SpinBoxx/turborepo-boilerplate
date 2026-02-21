import { useStore } from "@tanstack/react-form";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import {
	NumberField as NumberFieldComponent,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { useFieldContext } from "@/hooks/useFormContext";
import { Label } from "../ui/label";
import { ErrorMessages, type FieldErrorLike } from "./FormComponents";

interface Props {
	numberFieldProps?: ComponentProps<typeof NumberFieldComponent>;
	label?: string;
	className?: string;
}

export function NumberField({ numberFieldProps, label, className }: Props) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const numberFieldId = numberFieldProps?.id ?? field.name;
	const isInvalid = showErrors;

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<Label htmlFor={numberFieldId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<NumberFieldComponent aria-invalid={isInvalid} defaultValue={0}>
				<NumberFieldGroup>
					<NumberFieldDecrement />
					<NumberFieldInput />
					<NumberFieldIncrement />
				</NumberFieldGroup>
			</NumberFieldComponent>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
