import { CalendarX2Icon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotelContext } from "@/features/hotels/components/HotelProvider";
import RoomProvider from "../components/RoomProvider";
import RoomCard from "./RoomCard";

interface Props {
	isLoading?: boolean;
	skeletonCount?: number;
}

const RoomCardSkeleton = () => (
	<div className="overflow-hidden rounded-4xl border border-border/70 bg-card shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
		<Skeleton className="aspect-[1.65/1] w-full rounded-none" />
		<div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
			<div className="space-y-2">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
			<div className="flex flex-wrap gap-2.5">
				<Skeleton className="h-5 w-16 rounded-full" />
				<Skeleton className="h-5 w-16 rounded-full" />
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>
			<div className="flex items-end justify-between gap-4 pt-1">
				<Skeleton className="h-9 w-24" />
				<Skeleton className="h-10 w-32 rounded-lg" />
			</div>
		</div>
	</div>
);

const RoomCardListSkeleton = ({ count }: { count: number }) => (
	<div
		aria-busy="true"
		aria-live="polite"
		className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
	>
		{Array.from({ length: count }).map((_, index) => (
			<RoomCardSkeleton key={index} />
		))}
	</div>
);

const RoomCardList = ({ isLoading = false, skeletonCount }: Props) => {
	const {
		hotel: { rooms },
	} = useHotelContext();

	const t = useIntlayer("room-card-list");
	const loadingCardCount = skeletonCount ?? Math.max(rooms.length, 3);

	if (isLoading) {
		return <RoomCardListSkeleton count={loadingCardCount} />;
	}

	if (rooms.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 border-dashed bg-card/70 px-6 py-16 text-center">
				<CalendarX2Icon className="size-8 text-muted-foreground" />
				<h2 className="font-semibold text-xl">{t.noRoomsAvailable.value}</h2>
				<p className="max-w-xl text-muted-foreground">
					{t.noRoomsDescription.value}
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{rooms.map((room) => (
				<RoomProvider key={room.id} room={room}>
					<RoomCard />
				</RoomProvider>
			))}
		</div>
	);
};

export default RoomCardList;
