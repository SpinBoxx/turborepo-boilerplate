import {
	Button,
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
				<div className="no-scrollbar overflow-y-auto px-4">
					<div className="flex gap-2">
						<div className="flex-1 space-y-1.5">
							<p className="font-medium text-sm">Check-in</p>
						</div>
						<div className="flex-1 space-y-1.5">
							<p className="font-medium text-sm">Check-out</p>
						</div>
					</div>

					<div className="space-y-1.5">
						<p className="font-medium text-sm">Guests</p>
						{/* <BookingGuestCountInput /> */}
					</div>
				</div>
				<DrawerFooter>
					<Button>Save</Button>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
