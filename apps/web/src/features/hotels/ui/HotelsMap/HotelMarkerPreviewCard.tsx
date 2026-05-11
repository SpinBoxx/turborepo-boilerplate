import { Link } from "@tanstack/react-router";
import type { HotelComputed } from "@zanadeal/api/features/hotel";
import { cn } from "@zanadeal/ui";
import { ChevronRight, X } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardFooter,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import HotelAddress from "../../components/HotelAddress";
import HotelImage from "../../components/HotelImage";
import HotelName from "../../components/HotelName";
import HotelProvider from "../../components/HotelProvider";

interface Props {
	onClose: () => void;
	className?: string;
	hotel: HotelComputed;
}

export default function HotelMarkerPreviewCard({
	onClose,
	className,
	hotel,
}: Props) {
	const t = useIntlayer("hotel-marker-preview");

	return (
		<HotelProvider hotel={hotel}>
			<Card className={cn("w-64 gap-1 rounded-xl", className)}>
				<CardHeader className="p-3 pb-0!">
					<CardTitle>
						<HotelName />
					</CardTitle>
					<CardAction render={<Button variant={"ghost"} onClick={onClose} />}>
						<X />
					</CardAction>
				</CardHeader>
				<CardPanel className="p-3">
					<HotelAddress />
					<HotelImage className="mt-2 aspect-video h-32 w-full" />
				</CardPanel>
				<CardFooter className="p-3">
					<Link
						to="/$hotelId"
						params={{ hotelId: hotel.id }}
						className="w-full"
					>
						<Button className="w-full" type="button">
							{t.viewHotel.value} <ChevronRight className="size-4" />
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</HotelProvider>
	);
}
