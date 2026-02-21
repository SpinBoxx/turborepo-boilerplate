import { useStore } from "@tanstack/react-form";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useFormContext";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { ErrorMessages, type FieldErrorLike } from "./FormComponents";

export function TextField({
	inputProps,
	label,
	prefix,
	suffix,
	className,
}: {
	inputProps?: ComponentProps<"input">;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	label?: string;
	className?: string;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const inputId = inputProps?.id ?? field.name;
	const isInvalid = showErrors;

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<Label htmlFor={inputId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<InputGroup>
				{prefix && <InputGroupAddon>{prefix}</InputGroupAddon>}
				<InputGroupInput
					{...inputProps}
					id={inputId}
					aria-invalid={isInvalid}
					name={field.name}
					value={field.state.value}
					placeholder={inputProps?.placeholder || ""}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
				/>
				{suffix && (
					<InputGroupAddon align={"inline-end"}>{suffix}</InputGroupAddon>
				)}
			</InputGroup>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
