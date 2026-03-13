"use client";

import { cn } from "@zanadeal/ui";
import { stringToDate } from "@zanadeal/utils";
import { format } from "date-fns";
import { date as dateFormat } from "intlayer";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DropdownProps } from "react-day-picker";
import { useIntlayerContext } from "react-intlayer";
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
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";

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
	type: "checkIn" | "checkOut";
}

export default function CalendarWithComboBox({
	triggerProps,
	placeholder,
	type,
}: Props) {
	const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } =
		useBookingStore();
	const { locale } = useIntlayerContext();

	const date = type === "checkIn" ? checkInDate : checkOutDate;
	const setDate = type === "checkIn" ? setCheckInDate : setCheckOutDate;

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
							variant={triggerProps?.variant ?? "outline"}
							size={triggerProps?.size ?? "xl"}
							className={cn("w-full justify-start", triggerProps?.className)}
						/>
					}
				>
					<CalendarIcon aria-hidden="true" />
					{date ? dateFormat(date, { dateStyle: "full", locale }) : placeholder}
				</PopoverTrigger>
				<PopoverPopup>
					<Calendar
						required
						captionLayout="dropdown"
						components={{ Dropdown: CalendarDropdown }}
						defaultMonth={stringToDate(date)}
						endMonth={new Date(2028, 11)}
						mode="single"
						onSelect={setDate}
						selected={stringToDate(date)}
						startMonth={new Date()}
						disabled={{ before: new Date() }}
					/>
				</PopoverPopup>
			</Popover>
		</Field>
	);
}
