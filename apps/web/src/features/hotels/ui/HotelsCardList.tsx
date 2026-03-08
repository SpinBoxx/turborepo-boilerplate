import type { HotelComputed } from "@zanadeal/api/features/hotel";
import { cn } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import HotelProvider from "../components/HotelProvider";
import HotelCard from "./HotelCard";

interface Props extends ComponentProps<"div"> {
	hotels: HotelComputed[];
}

export default function HotelsCardList({ hotels, className, ...props }: Props) {
	if (!hotels?.length) return null;

	return (
		<div
			className={cn(
				"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
				className,
			)}
			{...props}
		>
			{hotels.map((hotel) => (
				<HotelProvider key={hotel.id} hotel={hotel}>
					<HotelCard />
				</HotelProvider>
			))}
		</div>
	);
}

const HotelCardSkeleton = () => (
	<div className="overflow-hidden rounded-2xl bg-card shadow-sm">
		<div className="aspect-4/3 animate-pulse bg-muted" />
		<div className="flex flex-col gap-2 p-4">
			<div className="flex items-start justify-between">
				<div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
				<div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
			</div>
			<div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
			<div className="pt-3">
				<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
			</div>
		</div>
	</div>
);

const HotelsCardListSkeleton = ({
	className,
	count = 6,
	...props
}: ComponentProps<"div"> & { count?: number }) => (
	<div
		className={cn(
			"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
			className,
		)}
		{...props}
	>
		{Array.from({ length: count }).map((_, i) => (
			<HotelCardSkeleton key={i} />
		))}
	</div>
);

HotelsCardList.Skeleton = HotelsCardListSkeleton;
