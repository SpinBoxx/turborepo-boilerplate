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
import CalendarWithComboBox from "@/components/calendar/CalendarWithComboBox";
import { Button } from "@/components/ui/button";
import BookingGuestCountInput from "./BookingGuestCountInput";

interface Props extends ComponentProps<"div"> {}

export function BookingInfoDrawer({ className, children, ...props }: Props) {
	return (
		<Drawer>
			<DrawerTrigger>{children}</DrawerTrigger>
			<DrawerContent className="max-h-[80vh]">
				<DrawerHeader>
					<DrawerTitle>Move Goal</DrawerTitle>
					<DrawerDescription>Set your daily activity goal.</DrawerDescription>
				</DrawerHeader>
				<div className="no-scrollbar space-y-3 overflow-y-auto px-4">
					<div className="flex gap-2">
						<div className="flex-1 space-y-1.5">
							<p className="font-medium text-sm">Check-in</p>
							<CalendarWithComboBox
								placeholder="Add date"
								triggerProps={{
									className:
										"w-full text-sm! font-light focus:ring-1 focus:ring-primary",
								}}
							/>
						</div>
						<div className="flex-1 space-y-1.5">
							<p className="font-medium text-sm">Check-out</p>
							<CalendarWithComboBox
								placeholder="Add date"
								triggerProps={{
									className:
										"w-full text-sm! font-light focus:ring-1 focus:ring-primary",
								}}
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<p className="font-medium text-sm">Guests</p>
						<BookingGuestCountInput />
					</div>
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button>Save</Button>
					</DrawerClose>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
