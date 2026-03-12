import type { ComponentProps } from "react";
import type { ButtonProps } from "@/components/ui/button";
import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
	type NumberFieldSize,
} from "@/components/ui/number-field";
import { useBookingStore } from "../hooks/useBookingHook";

interface Props extends ComponentProps<"div"> {
	max?: number;
	size?: NumberFieldSize;
}

const BookingGuestCountInput = ({ max, size }: Props) => {
	const { guestCount, maxGuests, increaseGuests, decreaseGuests } =
		useBookingStore();

	return (
		<NumberField
			defaultValue={guestCount}
			min={1}
			max={max || maxGuests}
			size={size || "default"}
		>
			<NumberFieldGroup>
				<NumberFieldDecrement onClick={decreaseGuests} />
				<NumberFieldInput className="text-center" />
				<NumberFieldIncrement onClick={increaseGuests} />
			</NumberFieldGroup>
		</NumberField>
	);
};

export default BookingGuestCountInput;
