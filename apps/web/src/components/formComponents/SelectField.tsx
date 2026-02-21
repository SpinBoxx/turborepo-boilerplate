import { useStore } from "@tanstack/react-form";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import {
	Select,
	type SelectButtonProps,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/hooks/useFormContext";
import { Label } from "../ui/label";
import { ErrorMessages, type FieldErrorLike } from "./FormComponents";

type SelectOption = {
	label: string;
	value: string;
};

interface Props {
	selectProps?: ComponentProps<typeof Select>;
	selectTriggerProps?: SelectButtonProps;
	label?: string;
	prefix?: React.ReactNode;
	className?: string;
	data: SelectOption[];
}

export function SelectField({
	data,
	selectProps,
	selectTriggerProps,
	label,
	prefix,
	className,
}: Props) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const inputId = selectProps?.id ?? field.name;
	const isInvalid = showErrors;

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<Label htmlFor={inputId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<Select
				aria-label="Select framework with icon"
				aria-invalid={isInvalid}
				items={data}
				{...selectProps}
			>
				<SelectTrigger {...selectTriggerProps}>
					{prefix && prefix}
					<SelectValue />
				</SelectTrigger>
				<SelectPopup alignItemWithTrigger={false}>
					{data.map(({ label, value }) => (
						<SelectItem key={value} value={value}>
							{label}
						</SelectItem>
					))}
				</SelectPopup>
			</Select>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
