import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { BookingInfoDrawer } from "@/features/booking/ui/BookingInfoDrawer";
import { containerClassName } from "@/routes/__root";
import HotelPricePerNight from "../components/HotelPricePerNight";

interface Props extends ComponentProps<"div"> {}

const HotelDetailFixedFooter = ({ className, ...props }: Props) => {
	const { hotelId } = useParams({
		from: "/_app/$hotelId/",
	});
	const { hasAllInfo } = useBookingStore();
	return (
		<div
			className={cn(
				"fixed inset-x-0 bottom-0 z-50 mx-auto w-full rounded-t-xl border-t bg-background py-2",
				containerClassName,
				className,
			)}
			{...props}
		>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-0">
					<span className="text-muted-foreground text-sm">From</span>
					<HotelPricePerNight />
				</div>
				{hasAllInfo() ? (
					<Link
						to={"/$hotelId/rooms"}
						params={{
							hotelId,
						}}
					>
						<Button size="xl">Select rooms</Button>
					</Link>
				) : (
					<BookingInfoDrawer>
						<Button size="xl">Select dates</Button>
					</BookingInfoDrawer>
				)}
			</div>
		</div>
	);
};

export default HotelDetailFixedFooter;
