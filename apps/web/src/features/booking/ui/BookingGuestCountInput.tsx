import type { ComponentProps } from "react";
import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { useBookingStore } from "../hooks/useBookingHook";

interface Props extends ComponentProps<"div"> {
	max?: number;
}

const BookingGuestCountInput = ({ max }: Props) => {
	const { guestCount, maxGuests, increaseGuests, decreaseGuests } =
		useBookingStore();

	return (
		<NumberField defaultValue={guestCount} min={1} max={max || maxGuests}>
			<NumberFieldGroup>
				<NumberFieldDecrement onClick={decreaseGuests} />
				<NumberFieldInput className="text-center" />
				<NumberFieldIncrement onClick={increaseGuests} />
			</NumberFieldGroup>
		</NumberField>
	);
};

export default BookingGuestCountInput;
