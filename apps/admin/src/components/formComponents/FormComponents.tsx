import { useStore } from "@tanstack/react-form";
import {
	Button,
	type ButtonVariants,
	cn,
	Input,
	Label,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Spinner,
	Switch as SwitchComp,
	Textarea,
	Select as UiSelect,
	Slider as UiSlider,
} from "@zanadeal/ui";
import { Eye, EyeClosed } from "lucide-react";
import { type ComponentProps, useId, useState } from "react";
import { useFieldContext, useFormContext } from "@/hooks/useFormContext";

export function SubscribeButton({
	label,
	icon,
	loadingLabel,
	variants,
}: {
	label?: string;
	icon?: React.ReactNode;
	loadingLabel?: string;
	loaderProps?: Record<string, never>;
	variants?: ButtonVariants;
}) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="submit"
					size={icon && !label ? "icon" : "default"}
					className={cn(!icon && "w-full")}
					variant={variants?.variant}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Spinner />
							{loadingLabel && <span className="ml-0">{loadingLabel}</span>}
						</>
					) : (
						<>
							{icon}
							{label}
						</>
					)}
				</Button>
			)}
		</form.Subscribe>
	);
}

// Default values shown

type FieldErrorLike = string | { message: string };

function ErrorMessages({ errors }: { errors: Array<FieldErrorLike> }) {
	return (
		<>
			{errors.map((error, index) => (
				<div
					key={`${index}-${typeof error === "string" ? error : error.message}`}
					className="mt-1 text-left font-bold text-red-500 text-sm"
				>
					{typeof error === "string" ? error : error.message}
				</div>
			))}
		</>
	);
}

export function TextField({
	inputProps,
	label,
	className,
}: {
	inputProps?: ComponentProps<"input">;
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
			<Input
				{...inputProps}
				id={inputId}
				aria-invalid={isInvalid}
				name={field.name}
				value={field.state.value}
				placeholder={inputProps?.placeholder || ""}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function PasswordField({
	inputProps,
	label,
}: {
	inputProps?: ComponentProps<"input">;
	label?: string;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const [_isShowPassword, _setIsShowPassword] = useState(false);
	const inputId = inputProps?.id ?? field.name;
	return (
		<div className="w-full">
			{label && (
				<Label htmlFor={inputId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<div className="relative">
				<Input
					className="pr-10"
					{...inputProps}
					id={inputId}
					aria-invalid={showErrors}
					type={_isShowPassword ? "text" : "password"}
					value={field.state.value}
					placeholder={inputProps?.placeholder || ""}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
				/>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="absolute top-1/2 right-2 -translate-y-1/2 p-0"
					onClick={() => _setIsShowPassword((v) => !v)}
				>
					{_isShowPassword ? <Eye /> : <EyeClosed />}
				</Button>
			</div>

			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function TextArea({
	label,
	className,
	rows = 3,
	...props
}: ComponentProps<"textarea"> & { label?: string }) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const fallbackId = useId();
	const textareaId = props.id ?? field.name ?? fallbackId;

	return (
		<div className="w-full">
			{label && (
				<Label htmlFor={textareaId} className="mb-2">
					{label}
				</Label>
			)}
			<Textarea
				{...props}
				id={textareaId}
				aria-invalid={showErrors}
				className={cn("text-sm", className)}
				value={field.state.value}
				onBlur={field.handleBlur}
				rows={rows}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function NumberField({
	label,
	inputProps,
}: {
	label?: string;
	inputProps?: Omit<ComponentProps<"input">, "type" | "value" | "onChange">;
}) {
	const field = useFieldContext<number>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;
	const inputId = inputProps?.id ?? field.name;

	return (
		<div className="w-full">
			{label && (
				<Label htmlFor={inputId} className="mb-0.5 font-semibold text-sm">
					{label}
				</Label>
			)}
			<Input
				{...inputProps}
				id={inputId}
				name={field.name}
				type="number"
				inputMode="numeric"
				aria-invalid={showErrors}
				value={
					Number.isFinite(field.state.value) ? String(field.state.value) : ""
				}
				onBlur={field.handleBlur}
				onChange={(e) => {
					const raw = e.target.value;
					field.handleChange(raw === "" ? 0 : Number(raw));
				}}
			/>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function Switch({ label }: { label: string }) {
	const field = useFieldContext<boolean>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;

	return (
		<div>
			<div className="flex items-center gap-2">
				<SwitchComp
					id={label}
					onBlur={field.handleBlur}
					checked={field.state.value}
					onCheckedChange={(checked) => field.handleChange(checked)}
				/>
				<Label htmlFor={label}>{label}</Label>
			</div>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function SwitchContainer({
	label,
	title,
	description,
}: {
	label: string;
	title: string;
	description?: string;
}) {
	const field = useFieldContext<boolean>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;

	return (
		<div>
			<div className="flex flex-row items-center justify-between rounded-lg border p-3">
				<div className="space-y-2">
					<Label htmlFor={label}>{title}</Label>
					{description ? (
						<p className="text-muted-foreground text-sm">{description}</p>
					) : null}
				</div>
				<SwitchComp
					id={label}
					onBlur={field.handleBlur}
					checked={field.state.value}
					onCheckedChange={(checked) => field.handleChange(checked)}
				/>
			</div>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function Select({
	label,
	placeholder,
	values,
}: {
	label: string;
	placeholder?: string;
	values: Array<{ label: string; value: string }>;
}) {
	const field = useFieldContext<string>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;

	return (
		<div>
			<UiSelect
				name={field.name}
				value={field.state.value}
				onValueChange={(value: string) => field.handleChange(value)}
				onOpenChange={(open) => {
					if (!open) {
						field.handleBlur();
					}
				}}
			>
				<Label className="mb-2">{label}</Label>
				<SelectTrigger
					className="w-full"
					aria-invalid={showErrors}
					onBlur={field.handleBlur}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{label}</SelectLabel>
						{values.map((value) => (
							<SelectItem key={value.value} value={value.value}>
								{value.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</UiSelect>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}

export function Slider({ label }: { label: string }) {
	const field = useFieldContext<number>();
	const errors = useStore(
		field.store,
		(state) => state.meta.errors,
	) as Array<FieldErrorLike>;
	const showErrors = field.state.meta.isTouched && errors.length > 0;

	return (
		<div>
			<Label htmlFor={label} className="mb-2 font-bold text-xl">
				{label}
			</Label>
			<UiSlider
				id={label}
				value={[field.state.value]}
				onValueChange={(value: number[]) => field.handleChange(value[0] ?? 0)}
				onValueCommit={() => field.handleBlur()}
			/>
			{showErrors && <ErrorMessages errors={errors} />}
		</div>
	);
}
