import { useStore } from "@tanstack/react-form";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useFieldContext } from "@/hooks/useFormContext";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ErrorMessages, type FieldErrorLike } from "./FormComponents";

interface Props {
	switchProps?: ComponentProps<typeof Switch>;
	label?: string;
	className?: string;
}

export function SwitchField({ switchProps, label, className }: Props) {
	const field = useFieldContext<boolean>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const switchId = switchProps?.id ?? field.name;
	const isInvalid = showErrors;

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<Label htmlFor={switchId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<Switch
				{...switchProps}
				id={switchId}
				aria-invalid={isInvalid}
				name={field.name}
				checked={field.state.value}
				onBlur={field.handleBlur}
				onCheckedChange={(checked) => field.handleChange(checked)}
			/>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
