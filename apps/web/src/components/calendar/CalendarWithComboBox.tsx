"use client";

import { cn } from "@zanadeal/ui";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DropdownProps } from "react-day-picker";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";

interface DropdownItem {
	disabled?: boolean;
	label: string;
	value: string;
}

function CalendarDropdown(props: DropdownProps) {
	const { options, value, onChange, "aria-label": ariaLabel } = props;

	const items: DropdownItem[] =
		options?.map((option) => ({
			disabled: option.disabled,
			label: option.label,
			value: option.value.toString(),
		})) ?? [];

	const selectedItem = items.find((item) => item.value === value?.toString());

	const handleValueChange = (newValue: DropdownItem | null) => {
		if (onChange && newValue) {
			const syntheticEvent = {
				target: { value: newValue.value },
			} as React.ChangeEvent<HTMLSelectElement>;
			onChange(syntheticEvent);
		}
	};

	return (
		<Combobox
			aria-label={ariaLabel}
			autoHighlight
			items={items}
			onValueChange={handleValueChange}
			value={selectedItem}
		>
			<ComboboxInput
				className="**:[input]:w-0 **:[input]:flex-1"
				onFocus={(e) => e.currentTarget.select()}
			/>
			<ComboboxPopup aria-label={ariaLabel}>
				<ComboboxEmpty>No items found.</ComboboxEmpty>
				<ComboboxList>
					{(item: DropdownItem) => (
						<ComboboxItem
							disabled={item.disabled}
							key={item.value}
							value={item}
						>
							{item.label}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}

interface Props {
	triggerProps?: ButtonProps;
	placeholder: string;
}

export default function CalendarWithComboBox({
	triggerProps,
	placeholder,
}: Props) {
	const [date, setDate] = React.useState<Date | undefined>();
	const id = React.useId();
	return (
		<Field className="w-full items-stretch">
			<Popover>
				<PopoverTrigger
					className="w-full"
					id={id}
					render={
						<Button
							{...triggerProps}
							className={cn("w-full justify-start", triggerProps?.className)}
							variant={triggerProps?.variant ?? "outline"}
							size={triggerProps?.size ?? "xl"}
						/>
					}
				>
					<CalendarIcon aria-hidden="true" />
					{date ? format(date, "PPP") : placeholder}
				</PopoverTrigger>
				<PopoverPopup>
					<Calendar
						captionLayout="dropdown"
						components={{ Dropdown: CalendarDropdown }}
						defaultMonth={date}
						endMonth={new Date()}
						mode="single"
						onSelect={setDate}
						selected={date}
						startMonth={new Date(1900, 0)}
					/>
				</PopoverPopup>
			</Popover>
		</Field>
	);
}
