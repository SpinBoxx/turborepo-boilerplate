import type { HotelComputed } from "@zanadeal/api/features/hotel";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import HotelProvider from "../components/HotelProvider";
import HotelCard from "./HotelCard";

interface Props extends ComponentProps<"div"> {
	hotels: HotelComputed[];
	direction?: "horizontal" | "vertical";
}

export default function HotelsList({ hotels, className, ...props }: Props) {
	if (!hotels) {
		return;
	}

	return (
		<div className={cn("", className)} {...props}>
			{hotels.map((hotel) => (
				<HotelProvider key={hotel.id} hotel={hotel}>
					<HotelCard />
				</HotelProvider>
			))}
		</div>
	);
}

const HotelCardSkeleton = () => {
	return <div className="h-40 w-full animate-pulse rounded-md bg-muted" />;
};

const HotelsListSkeleton = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div className={cn("", className)} {...props}>
			{Array.from({ length: 5 }).map((_, i) => (
				<HotelCardSkeleton key={i} />
			))}
		</div>
	);
};

HotelsList.Skeleton = HotelsListSkeleton;
