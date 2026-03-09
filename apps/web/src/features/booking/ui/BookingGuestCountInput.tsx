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
	const { guestCount, maxGuests } = useBookingStore();

	return (
		<NumberField defaultValue={guestCount} min={1} max={max || maxGuests}>
			<NumberFieldGroup>
				<NumberFieldDecrement />
				<NumberFieldInput className="text-center" />
				<NumberFieldIncrement />
			</NumberFieldGroup>
		</NumberField>
	);
};

export default BookingGuestCountInput;
