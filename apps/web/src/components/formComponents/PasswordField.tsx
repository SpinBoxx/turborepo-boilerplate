import { useStore } from "@tanstack/react-form";
import { cn } from "@zanadeal/ui";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { useFieldContext } from "@/hooks/useFormContext";
import { Button } from "../ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { ErrorMessages, type FieldErrorLike } from "./FormComponents";

interface Props {
	inputProps?: ComponentProps<"input">;
	label?: string;
	prefix?: React.ReactNode;
	className?: string;
}

export function PasswordField({ inputProps, label, prefix, className }: Props) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const inputId = inputProps?.id ?? field.name;
	const isInvalid = showErrors;

	const [showPassword, setShowPassword] = useState(false);

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
					type={showPassword ? "text" : "password"}
					aria-invalid={isInvalid}
					name={field.name}
					value={field.state.value}
					placeholder={inputProps?.placeholder || ""}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
				/>
				<InputGroupAddon align="inline-end">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label={showPassword ? "Hide password" : "Show password"}
									onClick={() => setShowPassword(!showPassword)}
									size="icon-xs"
									variant="ghost"
								/>
							}
						>
							{showPassword ? <EyeOffIcon /> : <EyeIcon />}
						</TooltipTrigger>
						<TooltipPopup>
							{showPassword ? "Hide password" : "Show password"}
						</TooltipPopup>
					</Tooltip>
				</InputGroupAddon>
			</InputGroup>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
