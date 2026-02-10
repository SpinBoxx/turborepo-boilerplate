import { Button, type ButtonVariants, cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import CalendarPricesDialog from "../../../../components/calendar/CalendarPricesDialog";
import { useRoomContext } from "./RoomProvider";

interface Props extends Omit<ComponentProps<"button">, "onClick"> {
	buttonProps: ButtonVariants;
}

export default function RoomPricesCalendarButton({
	className,
	children,
	buttonProps,
	...props
}: Props) {
	const { room } = useRoomContext();

	return (
		<CalendarPricesDialog prices={room.prices}>
			<Button {...props} {...buttonProps} className={cn("", className)}>
				{children}
			</Button>
		</CalendarPricesDialog>
	);
}
