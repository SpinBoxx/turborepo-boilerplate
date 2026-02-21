import { useStore } from "@tanstack/react-form";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useFormContext";
import { Label } from "../ui/label";
import { Textarea, type TextareaProps } from "../ui/textarea";
import { ErrorMessages, type FieldErrorLike } from "./FormComponents";

interface Props {
	textareaProps?: ComponentProps<"textarea"> & TextareaProps;
	label?: string;
	className?: string;
}

export function TextAreaField({ textareaProps, label, className }: Props) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const textareaId = textareaProps?.id ?? field.name;
	const isInvalid = showErrors;

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<Label htmlFor={textareaId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<Textarea
				{...textareaProps}
				size={textareaProps?.size}
				id={textareaId}
				aria-invalid={isInvalid}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
