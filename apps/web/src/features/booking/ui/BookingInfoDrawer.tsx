import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import CalendarWithComboBox from "@/components/calendar/CalendarWithComboBox";
import { Button } from "@/components/ui/button";
import BookingGuestCountInput from "./BookingGuestCountInput";

interface Props extends ComponentProps<"div"> {}

export function BookingInfoDrawer({ className, children, ...props }: Props) {
	const t = useIntlayer("booking-info-drawer");

	return (
		<Drawer>
			<DrawerTrigger>{children}</DrawerTrigger>
			<DrawerContent className="max-h-[80vh]">
				<DrawerHeader>
					<DrawerTitle>{t.bookingDetails.value}</DrawerTitle>
					<DrawerDescription>{t.setBookingDates.value}</DrawerDescription>
				</DrawerHeader>
				<div className="no-scrollbar space-y-3 overflow-y-auto px-4">
					<div className="flex gap-2">
						<div className="flex-1 space-y-1.5">
							<p className="font-medium text-sm">{t.checkIn.value}</p>
							<CalendarWithComboBox
								placeholder={t.addDate.value}
								triggerProps={{
									className:
										"w-full text-sm! font-light focus:ring-1 focus:ring-primary",
								}}
							/>
						</div>
						<div className="flex-1 space-y-1.5">
							<p className="font-medium text-sm">{t.checkOut.value}</p>
							<CalendarWithComboBox
								placeholder={t.addDate.value}
								triggerProps={{
									className:
										"w-full text-sm! font-light focus:ring-1 focus:ring-primary",
								}}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<p className="font-medium text-sm">{t.guests.value}</p>
						<BookingGuestCountInput />
					</div>
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button>{t.save.value}</Button>
					</DrawerClose>
					<DrawerClose asChild>
						<Button variant="outline">{t.cancel.value}</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
