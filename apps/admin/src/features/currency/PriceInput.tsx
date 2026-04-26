import { cn, Input, Label } from "@zanadeal/ui";
import { DEFAULT_CURRENCY, getCurrencySymbol } from "@zanadeal/utils";
import type { ComponentProps } from "react";

type PriceInputProps = Omit<
	ComponentProps<"input">,
	"id" | "onChange" | "type" | "value"
> & {
	currency?: string;
	id: string;
	label: string;
	onValueChange: (value: number | null) => void;
	value: number | null;
};

const MINOR_SCALE = 100;

const getCurrencyParts = (value: number | null) => {
	if (value === null || !Number.isFinite(value)) {
		return { major: "", minor: "0" };
	}

	const absoluteValue = Math.abs(value);
	const major = Math.trunc(absoluteValue);
	const minor = Math.round((absoluteValue - major) * MINOR_SCALE);

	return {
		major: String(major),
		minor: String(minor),
	};
};

const parseCurrencyParts = (major: string, minor: string) => {
	const normalizedMajor = major.replace(/\s/g, "");
	const normalizedMinor = minor.replace(/\s/g, "");

	if (!normalizedMajor && !normalizedMinor) return null;
	if (!/^\d*$/.test(normalizedMajor) || !/^\d*$/.test(normalizedMinor)) {
		return null;
	}

	const majorValue = normalizedMajor ? Number(normalizedMajor) : 0;
	const minorValue = normalizedMinor ? Number(normalizedMinor) : 0;

	return majorValue + minorValue / MINOR_SCALE;
};

export default function PriceInput({
	className,
	currency = DEFAULT_CURRENCY,
	id,
	label,
	onValueChange,
	value,
	...props
}: PriceInputProps) {
	const parts = getCurrencyParts(value);
	const minorId = `${id}-minor`;
	const symbol = getCurrencySymbol(currency);

	const updateValue = (nextMajor: string, nextMinor: string) => {
		onValueChange(parseCurrencyParts(nextMajor, nextMinor));
	};

	return (
		<div className={cn("space-y-1.5", className)}>
			<Label htmlFor={id} className="text-xs">
				{label}
			</Label>
			<div className="flex items-center gap-2">
				<Input
					{...props}
					id={id}
					inputMode="numeric"
					pattern="[0-9 ]*"
					placeholder="250000"
					type="text"
					value={parts.major}
					onChange={(event) => updateValue(event.target.value, parts.minor)}
					className="min-w-0 flex-1 tabular-nums"
				/>
				<Input
					aria-label={`${label} décimales`}
					id={minorId}
					inputMode="numeric"
					maxLength={2}
					pattern="[0-9]*"
					type="text"
					value={parts.minor}
					onChange={(event) => updateValue(parts.major, event.target.value)}
					className="w-16 tabular-nums"
				/>
				<span className="text-muted-foreground text-sm tabular-nums">
					{symbol}
				</span>
			</div>
		</div>
	);
}